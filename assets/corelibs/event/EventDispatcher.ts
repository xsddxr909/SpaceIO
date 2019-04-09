import IRelease from "../interface/IRelease";
import { Pool, IRecycleAble } from "../util/Pool";

export  class EventDispatcher implements IRelease
{
    protected m_mapEventListener: Map<number,Map<any,Array<Function>>>;
    constructor()
    {
        this.m_mapEventListener = new Map<number,Map<any,Array<Function>>>();
    }

    /**
     * 发送事件，直接转发数据
     * @param iEventId 事件对应唯一ID,ID请使用 >=1000000 的整数
     * @param data 事件传递参数
     */
    public dispatchEvent(iEventId: number,data?: any): void
    {
        let mapListen: Map<any,Array<Function>> = this.m_mapEventListener.get(iEventId);
        if(!mapListen) return;
        mapListen.forEach(function(arrCallback,that)
        {
            arrCallback.forEach(callback =>
            {
                callback.call(that,data);
            });
        });
    }

    /**
     * 绑定事件
     * @param iEventId 事件对应唯一ID,ID请使用 >=1000000 的整数
     * @param fnCallback 绑定的回调函数
     * @param bind 绑定的对象
     */
    public BindEvent(iEventId: number,fnCallback: Function,bind: any): void
    {
        let mapListen: Map<any,Array<Function>> = this.m_mapEventListener.get(iEventId);
        if(!mapListen)
        {
            mapListen = new Map<any,Array<Function>>();
            this.m_mapEventListener.set(iEventId,mapListen);
            let arrCallback: Array<Function> = new Array<Function>();
            arrCallback.push(fnCallback);
            mapListen.set(bind,arrCallback);
            return;
        }
        if(mapListen.has(bind))
        {
            let arrCallback: Array<Function> = mapListen.get(bind);
            let has = false;
            arrCallback.forEach(fn =>
            {
                if(fn == fnCallback)
                {
                    has = true;
                }
            });
            if(!has)
            {
                arrCallback.push(fnCallback);
            }
        }
        else
        {
            let arrCallback: Array<Function> = new Array<Function>();
            arrCallback.push(fnCallback);
            mapListen.set(bind,arrCallback);
        }
    }

    /**
     * 解绑事件
     * @param iEventId 事件对应唯一ID,ID请使用 >=1000000 的整数
     * @param fnCallback 绑定的回调函数
     * @param bind 绑定的对象
     */
    public UnbindEvent(iEventId: number,fnCallback: Function,bind: any): void
    {
        let mapListen: Map<any,Array<Function>> = this.m_mapEventListener.get(iEventId);
        if(mapListen && mapListen.has(bind))
        {
            let arrCallback: Array<Function> = mapListen.get(bind);
            if(arrCallback.length > 0)
            {
                let len = arrCallback.length - 1;
                let index = arrCallback.lastIndexOf(fnCallback);
                arrCallback[index] = arrCallback[len];
                arrCallback.length = len;
            }
        }
    }

    /**
     * 解绑该目标上注册的所有事件
     * @param target 需要解绑定的对象
     */
    public UnBindTarget(target: any): void
    {
        this.m_mapEventListener.forEach(function(mapListen)
        {
            if(mapListen.has(target))
            {
                mapListen.delete(target);
            }
        });
    }
    public ClearAll():void{
        this.m_mapEventListener.clear();
    }
    public Release(): void {
        this.m_mapEventListener.clear();
        this.m_mapEventListener=null;
    }
    
}
export class EventRecycleAble extends EventDispatcher implements IRecycleAble{
    poolname:string;
    id:number;
    pool: Pool<EventRecycleAble>;
    //是否被回收中 true为在Pool中;
    isRecycled: boolean=false;
    constructor(){
        super();
        this.id=0;
        this.isRecycled=false;
    }
    recycleSelf(): void {
        this.onRecycle();
        this.pool.recycle(this);
    }
    /**
     *需要重写 不能外部调用;
     **/ 
    onGet(): void {
      
    }
    /**
     *需要重写 不能外部调用;
     **/ 
    onRecycle(): void {
        this.m_mapEventListener.clear();
    }  
    /**
     *需要重写 不能外部调用;
     **/ 
    Release(): void {
        this.pool=null;
        super.Release();
    }
}