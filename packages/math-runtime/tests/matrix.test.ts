import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { matrixMatrixTrace, matrixVectorTrace } from "../src";
describe("matrix multiplication",()=>{
  it("calculates three house predictions",()=>expect(matrixVectorTrace({matrix:[[2,3,4],[4,2,5],[3,4,2]],vector:[5,2,3]}).result).toEqual([28,39,29]));
  it("supports rectangular matrix-vector and matrix-matrix operations",()=>{
    expect(matrixVectorTrace({matrix:[[1,2,3],[4,5,6]],vector:[1,0,-1]}).result).toEqual([-2,-2]);
    expect(matrixMatrixTrace({left:[[1,2,3],[4,5,6]],right:[[1,2],[0,1],[-1,3]]}).result).toEqual([[-2,13],[-2,31]]);
  });
  it("rejects empty, ragged, nonfinite, and incompatible inputs",()=>{
    expect(()=>matrixVectorTrace({matrix:[],vector:[]})).toThrow("non-empty");
    expect(()=>matrixVectorTrace({matrix:[[1,2],[3]],vector:[1,2]})).toThrow("rectangular");
    expect(()=>matrixVectorTrace({matrix:[[1,2]],vector:[1]})).toThrow("incompatible");
    expect(()=>matrixMatrixTrace({left:[[1,2]],right:[[1,2]]})).toThrow("incompatible");
    expect(()=>matrixVectorTrace({matrix:[[1,Infinity]],vector:[1,2]})).toThrow("finite");
  });
  it("matches Python fixtures within floating point tolerance",()=>{
    const path=fileURLToPath(new URL("../../math-contracts/fixtures/matrix.v1.json",import.meta.url));
    const fixture=JSON.parse(readFileSync(path,"utf8"));
    fixture.matrixVector.forEach((item:any)=>expect(matrixVectorTrace(item.input)).toEqual(item.trace));
    fixture.matrixMatrix.forEach((item:any)=>expect(matrixMatrixTrace(item.input)).toEqual(item.trace));
  });
});
