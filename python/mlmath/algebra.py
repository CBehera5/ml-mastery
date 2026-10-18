"""Bounded named algebra functions; additive algebra-trace.v1 reference."""
import math
from .calculus import linear_value
VERSION = "1.0.0"
def bounded(name, value, maximum=1000):
    if isinstance(value, bool) or not isinstance(value, (int,float)) or not math.isfinite(value) or abs(value)>maximum:
        raise ValueError(f"{name} must be finite with magnitude at most {maximum}")
    return value
def validate(spec):
    if not isinstance(spec,dict): raise ValueError("A named function is required")
    kind=spec.get('kind')
    if kind=='linear': bounded('coefficient',spec['a'],10); bounded('intercept',spec['b'],100)
    elif kind=='power':
        p=spec['exponent']
        if isinstance(p,bool) or not isinstance(p,(int,float)) or not math.isfinite(p) or int(p)!=p or p < -3 or p > 3: raise ValueError('exponent must be an integer from -3 to 3')
        bounded('scale',spec['scale'],10);bounded('shift',spec['shift'],10);bounded('offset',spec['offset'],100)
    elif kind in ('exponential','logarithm'):
        b=spec['base'];bounded('base',b,10)
        if b < .1 or (kind=='logarithm' and b==1): raise ValueError('invalid base')
    elif kind=='composition':
        if spec.get('order') not in ('f-after-g','g-after-f'): raise ValueError('Unknown composition order')
    else: raise ValueError('Unsupported named function')
def algebra_value(spec,x):
    validate(spec);bounded('input',x);kind=spec['kind']
    if kind=='logarithm' and x<=0: return {'value':None,'reason':'A real logarithm requires a strictly positive input. Zero and negative inputs are outside this domain.'}
    if kind=='power' and x==spec['shift'] and spec['exponent']<=0: return {'value':None,'reason':"This explorer leaves zero to a nonpositive power undefined: negative powers divide by zero, and 0⁰ needs a separate convention."}
    try:
        if kind=='linear': value=linear_value(x,spec['a'],spec['b'])
        elif kind=='power': value=spec['scale']*(x-spec['shift'])**spec['exponent']+spec['offset']
        elif kind=='exponential': value=float(spec['base'])**x
        elif kind=='logarithm': value=math.log(x)/math.log(spec['base'])
        else: value=linear_value(x*x,2,3) if spec['order']=='f-after-g' else linear_value(x,2,3)**2
    except OverflowError: value=math.inf
    if not math.isfinite(value) or abs(value)>1e12: return {'value':None,'reason':"The result exceeds this bounded explorer's numerical limit (magnitude 10¹²). This is a display/runtime limit, not a mathematical domain restriction."}
    return {'value':0 if value==0 else value,'reason':None}
def algebra_trace(spec,x):
    return {'schemaVersion':VERSION,'function':dict(spec),'input':x,'selected':algebra_value(spec,x),'samples':[{'input':i,**algebra_value(spec,i)} for i in [-4,-3,-2,-1,0,.5,1,2,3,4]]}
def linear_equation_trace(a,b,target):
    validate({'kind':'linear','a':a,'b':b});bounded('target',target,100)
    result={'schemaVersion':VERSION,'a':a,'b':b,'target':target,'status':'unique','solution':None}
    if a==0: result['status']='all-inputs' if b==target else 'no-solution'
    else:
        solution=(target-b)/a
        if not math.isfinite(solution) or abs(solution)>1000: raise ValueError('Solution exceeds the equation explorer input bound of 1000')
        result['solution']=solution
    return result
def mapping_trace(pairs):
    if not isinstance(pairs,list) or not 1<=len(pairs)<=16: raise ValueError('Mapping needs 1 to 16 input-output pairs')
    for pair in pairs:
        if not isinstance(pair,list) or len(pair)!=2: raise ValueError('Each mapping pair needs an input and output')
        for value in pair: bounded('mapping value',value)
    return {'schemaVersion':VERSION,'pairs':[list(p) for p in pairs],'isFunction':all(x!=xx or y==yy for x,y in pairs for xx,yy in pairs),'domain':list(dict.fromkeys(p[0] for p in pairs)),'range':list(dict.fromkeys(p[1] for p in pairs))}
def compound_growth_trace(n):
    if isinstance(n,bool) or not isinstance(n,(int,float)) or not math.isfinite(n) or int(n)!=n or not 1<=n<=10000: raise ValueError('compounding intervals must be an integer from 1 to 10000')
    return {'schemaVersion':VERSION,'intervals':n,'approximation':(1+1/n)**n,'e':math.e}
