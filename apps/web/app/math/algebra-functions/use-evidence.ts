"use client";
import {useEffect,useState} from "react";
import {parseLearningEvidence} from "../../learn/foundation/evidence";
import {emptyEvidence,STORAGE_KEY} from "./model";
export function useAlgebraEvidence(){const[evidence,setEvidence]=useState(emptyEvidence),[loaded,setLoaded]=useState(false),[storageError,setStorageError]=useState(false);useEffect(()=>{try{setEvidence(parseLearningEvidence(localStorage.getItem(STORAGE_KEY),"algebra.functions.v1"))}catch{setStorageError(true)}setLoaded(true)},[]);useEffect(()=>{if(loaded)try{localStorage.setItem(STORAGE_KEY,JSON.stringify(evidence))}catch{setStorageError(true)}},[loaded,evidence]);return{evidence,setEvidence,loaded,storageError}}
