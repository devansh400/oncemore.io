import type { OfficeStep } from "./signup-experience";

export function PipPortrait() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" shapeRendering="crispEdges">
      <path fill="#071A38" d="M6 3h12v3h3v12h-3v3H6v-3H3V6h3z" />
      <path fill="#FFC857" d="M6 7h12v11H6z" />
      <path fill="#153C70" d="M6 4h12v5H6zM8 11h2v2H8zm6 0h2v2h-2zm-4 5h4v2h-4z" />
      <path fill="#00D5C0" d="M6 19h12v5H6z" />
    </svg>
  );
}
function Tree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path fill="#153C70" d="M-6 0H6v50H-6z" />
      <path fill="#008f68" d="M-36-17h72v33h-72zM-26-37h52v64h-52zM-16-52h32v76h-32z" />
      <path fill="#55C928" d="M-30-21H2v21h-32zM-20-39H9v24h-29zM-9-49h18v18H-9z" />
      <path fill="#A4E84B" d="M-19-35h11v11h-11zM-28-16h10v9h-10z" />
    </g>
  );
}
function Cloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path fill="#00BDEB" opacity=".45" d="M0 25h150v16H0z" />
      <path fill="#fff" d="M0 12h24V0h26v-15h39v12h31v15h30v20H0z" />
      <path fill="#d0f5ff" d="M0 27h150v7H0z" />
    </g>
  );
}
export function PixelWorld({ step }: { step: OfficeStep }) {
  const sleeping = step === "welcome",
    calling = step === "calling",
    celebrating = step === "success" || step === "profile";
  return (
    <svg
      className="pixel-world-art"
      viewBox="0 0 1200 800"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="signup-water" x2="0" y2="1">
          <stop stopColor="#00BDEB" />
          <stop offset="1" stopColor="#00D5C0" />
        </linearGradient>
        <pattern id="signup-floor" width="48" height="32" patternUnits="userSpaceOnUse">
          <path fill="#d4f3e7" d="M0 0h48v32H0z" />
          <path fill="#b9e5dc" d="M0 0h24v16H0zm24 16h24v16H24z" />
        </pattern>
        <pattern id="signup-wall" width="48" height="32" patternUnits="userSpaceOnUse">
          <path fill="#eafaff" d="M0 0h48v32H0z" />
          <path fill="#c8edf5" d="M0 0h48v2H0zm0 0h2v32H0zm24 16h2v16h-2z" />
        </pattern>
      </defs>
      <g className="cloud cloud-a">
        <Cloud x={80} y={110} scale={0.85} />
      </g>
      <g className="cloud cloud-b">
        <Cloud x={930} y={120} scale={1.2} />
      </g>
      <g className="cloud cloud-c">
        <Cloud x={260} y={210} scale={0.5} />
      </g>
      <g fill="#5ed9e7" opacity=".5">
        <path d="M0 419h40v-35h45v-44h35v-40h25v-30h35v30h25v40h35v44h40v35h50v120H0zM860 435h50v-30h45v-50h32v-35h30v-35h25v35h35v45h30v40h45v30h48v100H860z" />
      </g>
      <path
        fill="#00a8a8"
        opacity=".55"
        d="M0 472h50v-20h50v-18h65v20h50v-28h70v24h70v32h480v-14h60v-28h65v-18h60v30h60v-17h65v30h45v25h60v150H0z"
      />
      <path fill="url(#signup-water)" d="M0 530h1200v270H0z" />
      <g className="water-shimmers" fill="#adfff0">
        <path
          opacity=".45"
          d="M18 632h75v4H18zm110 80h60v4h-60zm870-90h77v4h-77zm83 78h60v4h-60zM170 750h48v4h-48zm697-5h83v4h-83zM55 770h33v4H55z"
        />
        <path
          opacity=".25"
          d="M15 580h120v3H15zm1035 19h97v3h-97zm-45 159h100v3h-100zM225 698h25v3h-25z"
        />
      </g>
      <path fill="#0878a8" opacity=".35" d="M190 676h820v33h-40v25H255v-22h-65z" />
      <path fill="#153C70" d="M200 619h800v44h-30v25h-60v18H310v-18h-70v-24h-40z" />
      <path fill="#008c74" d="M200 608h800v36h-30v18h-60v18H310v-18h-70v-18h-40z" />
      <path fill="#00A86B" d="M190 588h830v37h-35v21H250v-16h-60z" />
      <path fill="#55C928" d="M205 570h785v14h30v28H190v-26h15z" />
      <path fill="#A4E84B" d="M225 566h745v12H225zm-20 20h80v8h-80zm700-4h85v8h-85z" />
      <g fill="#007b67">
        <path d="M295 637h12v13h-12zm25 23h18v9h-18zm542-18h16v12h-16zm69-11h12v13h-12z" />
      </g>
      <Tree x={246} y={493} scale={1.1} />
      <Tree x={956} y={500} scale={1.4} />
      <Tree x={999} y={544} scale={0.7} />
      <path fill="#071A38" d="M310 250h580v330H310z" />
      <path fill="url(#signup-wall)" d="M326 259h548v300H326z" />
      <path fill="#00a6bd" d="M310 259h16v316h-16zm564 0h16v316h-16z" />
      <path fill="#153C70" d="M310 547h580v32H310z" />
      <path fill="url(#signup-floor)" d="M310 551h580v49H310z" />
      <path fill="#8acec5" d="M310 600h580v10H310z" />
      <path fill="#071A38" d="M292 225h616v42H292zM320 213h560v12H320z" />
      <path fill="#153C70" d="M300 225h600v29H300z" />
      <path fill="#0878E8" d="M310 220h580v9H310zm-10 9h600v9H300z" />
      <path fill="#00BDEB" d="M320 213h560v6H320z" />
      <path fill="#153C70" d="M344 285h99v125h-99z" />
      <path fill="#00BDEB" d="M351 292h85v111h-85z" />
      <path fill="#fff" d="M357 316h22v-8h20v8h16v9h-58z" />
      <path fill="#55C928" d="M351 380h15v-17h15v-13h17v16h18v14h20v23h-85z" />
      <path fill="#153C70" d="M390 289h6v119h-6zm-43 59h93v6h-93z" />
      <path fill="#fff" d="M344 410h102v7H344z" />
      <path fill="#153C70" d="M779 290h72v107h-72z" />
      <path fill="#00a86b" d="M785 296h60v95h-60z" />
      <path fill="#fff" d="M794 307h43v59h-43z" />
      <path fill="#55C928" d="M800 315h8v8h-8zm13 0h17v4h-17zm-13 14h30v4h-30zm0 9h22v4h-22z" />
      <path fill="#FFC857" d="M804 372h25v8h-25z" />
      <path fill="#153C70" d="M817 260h32v7h7v32h-7v7h-32v-7h-7v-32h7z" />
      <path fill="#fff" d="M820 267h25v30h-25zM817 272h31v20h-31z" />
      <path fill="#0878E8" d="M830 271h4v14h-4zm0 10h12v4h-12z" />
      <path fill="#153C70" d="M347 454h78v93h-78z" />
      <path fill="#00A86B" d="M352 460h68v25h-68zm0 30h68v25h-68zm0 30h68v23h-68z" />
      <path fill="#00D5C0" d="M377 470h18v4h-18zm0 30h18v4h-18zm0 28h18v4h-18z" />
      <path fill="#FFC857" d="M353 443h23v10h-23z" />
      <path fill="#0878E8" d="M378 436h9v17h-9z" />
      <path fill="#00D5C0" d="M390 439h22v14h-22z" />
      <g
        className={`pixel-pip ${sleeping ? "is-sleeping" : ""} ${celebrating ? "is-celebrating" : ""}`}
      >
        <path fill="#153C70" d="M560 383h80v112h-80z" />
        <path fill="#00A86B" d="M567 390h66v98h-66z" />
        <path
          fill="#071A38"
          d="M574 298h52v7h10v14h7v49h-7v11h-10v7h-52v-7h-10v-11h-7v-49h7v-14h10z"
        />
        <path fill="#FFC857" d="M570 321h60v46h-8v11h-44v-11h-8zM563 335h8v18h-8zm67 0h8v18h-8z" />
        <path fill="#153C70" d="M570 309h57v13h-9v7h-18v-8h-15v8h-15z" />
        <g className="pip-eyes" fill="#071A38">
          {sleeping ? (
            <path d="M579 342h10v4h-10zm31 0h10v4h-10z" />
          ) : (
            <path d="M580 338h7v9h-7zm30 0h7v9h-7z" />
          )}
        </g>
        <path fill="#fff" d={celebrating ? "M588 356h24v7h-24z" : "M593 360h13v4h-13z"} />
        <path fill="#f09b46" d="M575 352h9v5h-9zm41 0h9v5h-9z" />
        <path fill="#071A38" d="M575 382h50v8h13v60h-76v-60h13z" />
        <path fill="#00D5C0" d="M570 390h60v57h-60z" />
        <path fill="#fff" d="M585 383h30v12h-8v7h-14v-7h-8z" />
        <path fill="#0878E8" d="M596 396h8v29h-8z" />
        {celebrating ? (
          <>
            <path fill="#071A38" d="M545 348h12v44h16v16h-28zM627 392h17v-44h12v60h-29z" />
            <path fill="#FFC857" d="M543 336h15v17h-15zm99 0h15v17h-15z" />
          </>
        ) : calling ? (
          <>
            <path fill="#00D5C0" d="M552 372h17v40h-17z" />
            <path fill="#FFC857" d="M550 354h17v24h-17z" />
            <path fill="#071A38" d="M545 328h12v45h-12zm-4-5h21v12h-21zm0 43h21v12h-21z" />
            <path fill="#00D5C0" d="M631 394h18v45h-18z" />
          </>
        ) : (
          <>
            <path fill="#00D5C0" d="M548 395h20v39h-20zm84 0h20v39h-20z" />
            <path fill="#FFC857" d="M548 431h20v14h-20zm84 0h20v14h-20z" />
          </>
        )}
        {sleeping && (
          <g className="pixel-zzz" fill="#fff">
            <path d="M648 299h16v4h-5v4h-5v4h10v4h-16v-4h5v-4h5v-4h-10zM668 280h12v3h-4v4h-4v3h8v3h-12v-3h4v-4h4v-3h-8z" />
          </g>
        )}
        {celebrating && (
          <>
            <path fill="#FFC857" d="M572 285h8v-13h10v10h19v-10h10v13h9v10h-56z" />
            <path fill="#fff" d="M590 287h19v4h-19z" />
          </>
        )}
      </g>
      <path fill="#071A38" d="M380 565h440v21H380zm13 21h17v48h-17zm397 0h17v48h-17z" />
      <path fill="#FFC857" d="M376 556h448v18H376z" />
      <path fill="#dfa540" d="M384 574h432v11H384z" />
      <path fill="#fff0ad" d="M384 556h432v5H384z" />
      <g className={calling ? "pixel-phone is-ringing" : "pixel-phone"}>
        <path fill="#071A38" d="M774 528h57v26h-57z" />
        <path fill="#00A86B" d="M780 531h45v17h-45z" />
        <path fill="#fff" d="M792 534h18v9h-18z" />
        {!calling && <path fill="#153C70" d="M772 520h61v10h-61zm0-5h13v8h-13zm48 0h13v8h-13z" />}
      </g>
      <path fill="#153C70" d="M407 524h29v29h-29zm28 4h10v18h-10z" />
      <path fill="#fff" d="M411 527h21v22h-21zm25 5h5v9h-5z" />
      <path fill="#071A38" d="M414 525h15v4h-15z" />
      <g className="coffee-steam" fill="#fff">
        <path d="M415 509h4v9h-4zm9-8h4v11h-4z" />
      </g>
      <path fill="#153C70" d="M843 526h37v37h-37z" />
      <path fill="#FFC857" d="M848 532h27v25h-27z" />
      <path
        fill="#00A86B"
        d="M859 478h6v54h-6zm-19 15h19v10h-19zm24-14h22v10h-22zm-28-5h25v10h-25zm28 20h17v10h-17z"
      />
      <path
        fill="#55C928"
        d="M838 467h17v10h-17zm30 3h21v10h-21zm-21 32h13v8h-13zm19 7h13v8h-13z"
      />
      <path fill="#e4f4cd" d="M570 634h60v13h18v15h-96v-15h18z" />
      <path fill="#bdeaa8" d="M552 662h96v7h-96z" />
      <g fill="#fff">
        <path d="M279 585h5v-5h5v5h5v5h-5v5h-5v-5h-5zM925 574h5v-5h5v5h5v5h-5v5h-5v-5h-5zM891 609h4v-4h5v4h4v5h-4v4h-5v-4h-4z" />
      </g>
      <g fill="#FFC857">
        <path d="M284 585h5v5h-5zm646-11h5v5h-5zm-35 35h5v5h-5z" />
      </g>
      <g className="pixel-butterfly" fill="#FFC857">
        <path d="M1025 356h8v8h-8zm13 0h8v8h-8zm-10 8h7v5h-7zm8 0h7v5h-7z" />
        <path fill="#153C70" d="M1034 359h3v12h-3z" />
      </g>
    </svg>
  );
}
