import { State, StateMachine } from "../../../corelibs/state/StateMachine";
import { ENUMS } from "../../common/Enum";
import { Character } from "../Character";

  
  //死亡状态;
 export class Char_Dead extends State<Character>
 {
        constructor(machine:StateMachine<Character>)
        {
           super(machine);
           this.m_nStateID = ENUMS.CharState.Char_Dead;
        }
        // 进入状态
        public Enter(param:any):void{
            
        }
        public Leave(): void {
            
        }
        public Update(dt: number): void {
           
        }
        public OnEvent(EventID: number, param: any): void {
            
        }
    
 }