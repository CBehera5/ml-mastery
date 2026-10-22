"use client";

import {useRef, useState} from "react";
import styles from "../journey.module.css";

/** Unscored introduction. It never reads or writes the saved experiment. */
export function CurveDiscovery() {
  const [prediction, setPrediction] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [size, setSize] = useState(2);
  const result = useRef<HTMLHeadingElement>(null);
  const straight = (x:number) => 1 + 2*x;
  const curved = (x:number) => 1 + 2*x + 3*x*x;
  const px = (x:number) => 60 + x*90;
  const py = (y:number) => 220 - y*5;
  const points = Array.from({length:31}, (_, i) => i/10);
  return <div className="why-regression-lesson"><section id="lesson-context" className="why-story">
    <h2>What if prices do not follow a straight line?</h2>
    <p>A larger house usually costs more. But an extra amount of space may add more to the price of a large house than to a small one. A straight line cannot show that changing rate: it adds the same amount for every equal increase in size.</p>
    <p>Polynomial regression gives the model a way to bend. We will add just one number: the size multiplied by itself.</p>
    <aside className={styles.discovery}><strong>Our simplified example</strong><p>We use a fictional house-size index x, with values 1, 2 and 3. It is a scaled input, not square feet. Prices are in ₹ lakh. The small numbers make the arithmetic visible; these formulas illustrate a mechanism, not a fitted housing model.</p></aside>
    </section><section className="why-suitability"><h2>Start with a familiar straight line</h2>
    <p><strong>Predicted price = 1 + 2 × x.</strong> The baseline is 1. The coefficient 2 adds 2 price units for each extra size unit.</p>
    <p>At sizes 1, 2 and 3, this rule predicts 3, 5 and 7. Each step adds 2, so the graph is a straight line.</p>
    </section><section className="why-suitability" id="curve-experiment"><h2>Give the rule one way to bend</h2>
    <p>Keep that rule and add <strong>3 × x²</strong>. The symbol x² means x × x. At sizes 1, 2 and 3, the squared sizes are 1, 4 and 9. This extra contribution grows faster as size increases.</p>
    <label>Before seeing the result: at size 2, what will adding 3 × x² do?
      <select value={prediction} onChange={event=>{setPrediction(event.target.value);setRevealed(false);}}>
        <option value="">Choose your prediction</option>
        <option value="higher">Raise the predicted price</option>
        <option value="same">Leave the predicted price unchanged</option>
        <option value="lower">Lower the predicted price</option>
        <option value="unsure">I’m not sure yet</option>
      </select>
    </label>
    <button disabled={!prediction} onClick={()=>{setSize(2);setRevealed(true);requestAnimationFrame(()=>result.current?.focus());}}>Compare the straight line and curve</button>
    {revealed&&<div>
      <h3 ref={result} tabIndex={-1}>The added term raises the prediction from 5 to 17</h3>
      <p role="status">{prediction==="higher"?"Your direction prediction matched.":prediction==="unsure"?"Let’s trace the calculation together.":"The prediction rises; compare the extra contribution below."} At x = 2, x² = 4, so the new term adds 3 × 4 = 12. The previous prediction was 5; 5 + 12 = 17.</p>
      <label>Try another house-size index
        <select value={size} onChange={event=>setSize(Number(event.target.value))}>{[1,2,3].map(x=><option key={x} value={x}>Size index {x}</option>)}</select>
      </label>
      <p aria-live="polite"><strong>At size {size}:</strong> straight rule = {straight(size)}; curved rule = {curved(size)}; the squared term adds {3*size*size}. These values are in ₹ lakh.</p>
      <figure className="regression-figure">
        <svg viewBox="0 0 400 285" role="img" aria-label="A dashed straight line increases by equal amounts; a solid curved line gets steeper. Exact predictions are in the table below.">
          <path d="M60 25V220H350" fill="none" stroke="currentColor"/>
          {[0,10,20,30].map(y=><g key={y}><text x="28" y={py(y)+4} fontSize="12">{y}</text><path d={`M56 ${py(y)}H350`} stroke="#d7ded5"/></g>)}
          {[0,1,2,3].map(x=><text key={x} x={px(x)-3} y="240" fontSize="12">{x}</text>)}
          <polyline points={points.map(x=>`${px(x)},${py(straight(x))}`).join(" ")} fill="none" stroke="#59636c" strokeWidth="3" strokeDasharray="7 4"/>
          <polyline points={points.map(x=>`${px(x)},${py(curved(x))}`).join(" ")} fill="none" stroke="#245e4f" strokeWidth="3"/>
          <circle cx={px(size)} cy={py(curved(size))} r="6" fill="#ac4d24"/>
          <text x="60" y="16" fontSize="13">Predicted price (₹ lakh)</text>
          <text x="145" y="266" fontSize="13">House-size index x</text>
        </svg>
        <figcaption>Read from left to right as size increases. The dashed line rises evenly. The solid curve gets steeper because x² grows faster. The dot marks your selected size. Both axes keep the same scale as you explore.</figcaption>
      </figure>
      <table><caption>The same formulas, compared at three sizes</caption><thead><tr><th scope="col">Size x</th><th scope="col">Square x²</th><th scope="col">Straight price</th><th scope="col">Curved price</th></tr></thead><tbody>{[1,2,3].map(x=><tr key={x}><th scope="row">{x}</th><td>{x*x}</td><td>{straight(x)}</td><td>{curved(x)}</td></tr>)}</tbody></table>
      <p>The straight predictions rise by 2, then 2. The curved predictions rise by 11, then 17. That changing increase is the bend. Adding a squared term <em>allows</em> a curve; whether it improves predictions must be checked on data not used for fitting.</p>
    </div>}
    </section><section className="why-suitability"><h2>Now give the relationship its mathematical name</h2>
    <div className="equation-readout"><strong>ŷ = b + w₁x + w₂x²</strong><span>Predicted price = baseline + size contribution + squared-size contribution</span><b>17 = 1 + 2 × 2 + 3 × 4</b></div>
    <ul><li><strong>ŷ</strong> (say “y hat”) is the predicted price.</li><li><strong>x</strong> is our size index; <strong>x²</strong> is its square.</li><li><strong>b = 1</strong> is the baseline, also called the intercept.</li><li><strong>w₁ = 2</strong> and <strong>w₂ = 3</strong> are coefficients: multiply each by its matching input, then add the contributions.</li></ul>
    <p>Why is this still a kind of linear regression? At a fixed size, the inputs x and x² are fixed numbers. The coefficients simply multiply them and add together. The <em>input</em> is squared; the coefficients are not. That is what “curved in x, linear in the coefficients” means.</p>
    <p><strong>Takeaway:</strong> we create extra measurements from the same input to let a weighted sum describe a curve. We have not created extra houses or proved that size causes a particular price.</p>
    <p>This introduction is unscored. Continue to the full experiment and practice below when you are ready.</p>
  </section></div>;
}
