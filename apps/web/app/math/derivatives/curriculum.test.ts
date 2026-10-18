import{describe,expect,it}from"vitest";
import{buggyLossDerivative,debugLossDerivative,parseTopicProgress,scoreAssessment}from"./curriculum";
describe("derivatives curriculum logic",()=>{
 it("scores demonstrated competence separately from completion",()=>{const result=scoreAssessment({concept:"sensitivity",calculation:"6",graph:"negative",application:"increase",debug:"6"});expect(result).toMatchObject({score:5,total:5,mastered:true})});
 it("requires four distinct capabilities for mastery",()=>{const result=scoreAssessment({concept:"sensitivity",calculation:"wrong",graph:"negative",application:"wrong",debug:"6"});expect(result.mastered).toBe(false);expect(result.score).toBe(3)});
 it("uses alternative answers on retry",()=>{expect(scoreAssessment({concept:"sensitivity",calculation:"20",graph:"positive",application:"decrease",debug:"6"},1).mastered).toBe(true)});
 it("repairs the ML derivative with the missing chain factor",()=>{expect(buggyLossDerivative(2)).toBe(-4);expect(debugLossDerivative(2)).toBe(-8)});
 it("safely parses persisted progress",()=>{expect(parseTopicProgress("broken").completed).toEqual([]);expect(parseTopicProgress('{"completed":["lab"],"mastered":true,"bestScore":4}')).toEqual({completed:["lab"],mastered:true,bestScore:4})});
});
