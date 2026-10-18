"""Scalar functions and derivative traces for learning."""
from __future__ import annotations
import math
from typing import Callable

CALCULUS_SCHEMA_VERSION="1.0.0"
def _finite(name:str,value:float)->float:
    try: number=float(value)
    except (TypeError,ValueError) as exc: raise ValueError(f"{name} must be a finite number") from exc
    if not math.isfinite(number): raise ValueError(f"{name} must be a finite number")
    return number
def linear_value(x:float,a:float=5,b:float=10)->float: return _finite("a",a)*_finite("x",x)+_finite("b",b)
def quadratic_value(x:float)->float: x=_finite("x",x); return x*x
def linear_derivative(a:float=5)->float: return _finite("a",a)
def quadratic_derivative(x:float)->float: return 2*_finite("x",x)
def squared_loss(weight:float)->float: w=_finite("weight",weight); return (2*w-6)**2
def loss_derivative(weight:float)->float: w=_finite("weight",weight); return 4*(2*w-6)
def central_derivative(function:Callable[[float],float],x:float,h:float=1e-5)->float:
    x,step=_finite("x",x),_finite("h",h)
    if step<=0: raise ValueError("h must be greater than 0")
    result=(function(x+step)-function(x-step))/(2*step)
    if not math.isfinite(result): raise ValueError("derivative calculation produced a nonfinite result")
    return result
def secant_slope(function:Callable[[float],float],x:float,h:float)->float:
    x,step=_finite("x",x),_finite("h",h)
    if step==0: raise ValueError("h must not be 0")
    result=(function(x+step)-function(x))/step
    if not math.isfinite(result): raise ValueError("secant calculation produced a nonfinite result")
    return result
def calculus_trace(weight:float,h:float=0.5)->dict:
    w,step=_finite("weight",weight),_finite("h",h)
    if step<=0: raise ValueError("h must be greater than 0")
    prediction=2*w; loss=squared_loss(w); derivative=loss_derivative(w)
    return {"schemaVersion":CALCULUS_SCHEMA_VERSION,"input":{"weight":w,"h":step},"model":{"input":2.0,"target":6.0,"prediction":prediction,"loss":loss},"derivative":{"analytical":derivative,"numerical":central_derivative(squared_loss,w,min(step,1e-5)),"secant":secant_slope(squared_loss,w,step),"tangent":{"point":[w,loss],"slope":derivative,"intercept":loss-derivative*w}}}
