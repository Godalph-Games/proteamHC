import { useState, useEffect } from "react";

const SK = { equipment:"pt-equipment", log:"pt-log", counter:"pt-counter", volunteers:"pt-volunteers" };
const defaultEquipment = [
  {id:"HC-001",name:"Osmo Camera 1",category:"Camera",make:"DJI Osmo",serial:"",storage:"Camera Bag A",condition:"Good",notes:"Label: OSMO 1",status:"available",checkedOutTo:null,checkedOutCode:null,checkedOutEvent:null,checkedOutDate:null,expectedReturn:null},
  {id:"HC-002",name:"Osmo Camera 2",category:"Camera",make:"DJI Osmo",serial:"",storage:"Camera Bag A",condition:"Good",notes:"Label: OSMO 2",status:"available",checkedOutTo:null,checkedOutCode:null,checkedOutEvent:null,checkedOutDate:null,expectedReturn:null},
  {id:"HC-003",name:"Osmo Camera 3",category:"Camera",make:"DJI Osmo",serial:"",storage:"Camera Bag A",condition:"Good",notes:"Label: OSMO 3",status:"available",checkedOutTo:null,checkedOutCode:null,checkedOutEvent:null,checkedOutDate:null,expectedReturn:null},
  {id:"HC-004",name:"Sony Camera Body",category:"Camera",make:"Sony",serial:"",storage:"Camera Bag B",condition:"Good",notes:"",status:"available",checkedOutTo:null,checkedOutCode:null,checkedOutEvent:null,checkedOutDate:null,expectedReturn:null},
  {id:"HC-005",name:"Sony Camera Lens",category:"Lens",make:"Sony",serial:"",storage:"Camera Bag B",condition:"Good",notes:"Stored with HC-004",status:"available",checkedOutTo:null,checkedOutCode:null,checkedOutEvent:null,checkedOutDate:null,expectedReturn:null},
  {id:"HC-006",name:"Osmo Battery 1",category:"Battery / Charger",make:"DJI",serial:"",storage:"Charging Station",condition:"Good",notes:"For HC-001",status:"available",checkedOutTo:null,checkedOutCode:null,checkedOutEvent:null,checkedOutDate:null,expectedReturn:null},
  {id:"HC-007",name:"Osmo Battery 2",category:"Battery / Charger",make:"DJI",serial:"",storage:"Charging Station",condition:"Good",notes:"For HC-002",status:"available",checkedOutTo:null,checkedOutCode:null,checkedOutEvent:null,checkedOutDate:null,expectedReturn:null},
  {id:"HC-008",name:"Osmo Battery 3",category:"Battery / Charger",make:"DJI",serial:"",storage:"Charging Station",condition:"Good",notes:"For HC-003",status:"available",checkedOutTo:null,checkedOutCode:null,checkedOutEvent:null,checkedOutDate:null,expectedReturn:null},
  {id:"HC-009",name:"Sony Camera Battery",category:"Battery / Charger",make:"Sony",serial:"",storage:"Charging Station",condition:"Good",notes:"For HC-004",status:"available",checkedOutTo:null,checkedOutCode:null,checkedOutEvent:null,checkedOutDate:null,expectedReturn:null},
  {id:"HC-011",name:"Tripod 1",category:"Tripod / Mount",make:"TBD",serial:"",storage:"Storage Closet",condition:"Good",notes:"",status:"available",checkedOutTo:null,checkedOutCode:null,checkedOutEvent:null,checkedOutDate:null,expectedReturn:null},
];
const defaultVolunteers = [{id:"V001",name:"Brandon",code:"0000",role:"AV Director",active:true}];

async function load(key,fallback){try{const r=await window.storage.get(key);return JSON.parse(r.value);}catch{return fallback;}}
async function save(key,val){try{await window.storage.set(key,JSON.stringify(val));}catch{}}

const CAT={"Camera":{bar:"#1a4a9e",bg:"#e8f0fb",chip:"#1a4a9e"},"Lens":{bar:"#1a4a9e",bg:"#e8f0fb",chip:"#1a4a9e"},"Battery / Charger":{bar:"#c8992a",bg:"#fff8e6",chip:"#a06000"},"Tripod / Mount":{bar:"#2e7d4f",bg:"#edf7ee",chip:"#1a6b3a"},"Audio":{bar:"#6a3d9a",bg:"#f5eefb",chip:"#6a3d9a"},"Lighting":{bar:"#b8860b",bg:"#fef9e7",chip:"#8b6914"},"Other":{bar:"#888",bg:"#f5f5f5",chip:"#555"}};
const cs=(cat)=>CAT[cat]||CAT["Other"];

const Ic=({n,size=16,color="currentColor"})=>{const d={plus:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,trash:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>,edit:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,check:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,x:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,logout:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,search:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,shield:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,eye:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,eyeoff:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>};return d[n]||null;};

const lbl={fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:2,color:"#999",display:"block",marginBottom:6};
const inp={width:"100%",padding:"9px 12px",border:"1px solid #ddd8ce",borderRadius:8,fontSize:14,color:"#1a1a2e",background:"#faf8f4"};

function CodeInput({value,onChange,shake}){
  const refs=[{current:null},{current:null},{current:null},{current:null}];
  const handleDigit=(i,v)=>{if(!/^\d?$/.test(v))return;const a=(value+"    ").slice(0,4).split("");a[i]=v.slice(-1);onChange(a.join("").trimEnd());if(v&&i<3)refs[i+1].current?.focus();};
  const handleKey=(i,e)=>{if(e.key==="Backspace"&&!value[i]&&i>0)refs[i-1].current?.focus();};
  return(
    <div style={{display:"flex",gap:10,justifyContent:"center",animation:shake?"shake .35s ease":"none"}}>
      {[0,1,2,3].map(i=>(
        <input key={i} ref={refs[i]} type="password" maxLength={1} value={value[i]||""} onChange={e=>handleDigit(i,e.target.value)} onKeyDown={e=>handleKey(i,e)}
          style={{width:52,height:60,textAlign:"center",fontSize:26,fontFamily:"'DM Mono',monospace",fontWeight:500,border:"2px solid",borderColor:shake?"#e74c3c":value[i]?"#0f1f3d":"#ddd8ce",borderRadius:10,background:value[i]?"#f0f4ff":"#faf8f4",color:"#0f1f3d",caretColor:"transparent",transition:"border-color .2s,background .2s"}}/>
      ))}
    </div>
  );
}

function VolLookup({volunteers,onFound,submitLabel="Continue →"}){
  const [name,setName]=useState("");
  const [code,setCode]=useState("");
  const [shake,setShake]=useState(false);
  const [err,setErr]=useState("");
  const verify=()=>{
    const match=volunteers.find(v=>v.active&&v.code===code&&v.name.toLowerCase()===name.trim().toLowerCase());
    if(match){setErr("");onFound(match);}
    else{setShake(true);setErr("Name or code not recognized. Contact your AV Director.");setTimeout(()=>setShake(false),400);}
  };
  const ready=name.trim().length>1&&code.length===4;
  return(
    <div>
      <div style={{marginBottom:14}}><label style={lbl}>Your Full Name</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="First and last name" style={inp}/></div>
      <div style={{marginBottom:err?8:18}}><label style={{...lbl,marginBottom:10}}>Your 4-Digit Volunteer Code</label><CodeInput value={code} onChange={setCode} shake={shake}/></div>
      {err&&<div style={{color:"#b91c1c",fontSize:12,marginBottom:12,textAlign:"center",background:"#fee2e2",padding:"8px 12px",borderRadius:7}}>{err}</div>}
      <button onClick={verify} disabled={!ready} style={{width:"100%",padding:"11px",background:ready?"#0f1f3d":"#ddd",color:"#fff",border:"none",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:2,cursor:ready?"pointer":"not-allowed",transition:"background .2s"}}>{submitLabel}</button>
    </div>
  );
}

function Modal({title,subtitle,onClose,children}){
  return(
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"rgba(10,20,45,.65)",backdropFilter:"blur(4px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:500,overflow:"hidden",boxShadow:"0 32px 80px rgba(10,20,45,.3)",animation:"mIn .22s ease",maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{background:"#0f1f3d",padding:"20px 24px",position:"relative"}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:"#fff",letterSpacing:2}}>{title}</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.4)",marginTop:2}}>{subtitle}</div>
          <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,.1)",border:"none",color:"#fff",width:28,height:28,borderRadius:"50%",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic n="x" size={13}/></button>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:"linear-gradient(90deg,#c8992a,transparent)"}}/>
        </div>
        <div style={{padding:"22px 24px 24px"}}>{children}</div>
      </div>
    </div>
  );
}

function CheckoutModal({item,volunteers,onSubmit,onClose}){
  const [step,setStep]=useState("auth");
  const [vol,setVol]=useState(null);
  const [event,setEvent]=useState("");
  const [ret,setRet]=useState("");
  const [cond,setCond]=useState("Good");
  const [notes,setNotes]=useState("");
  const [charged,setCharged]=useState(false);
  return(
    <Modal title="Checkout" subtitle={`${item.name} · ${item.id}`} onClose={onClose}>
      {step==="auth"?(
        <>
          <div style={{background:"#f0f4ff",border:"1px solid #c8d8f8",borderRadius:8,padding:"10px 14px",marginBottom:18,fontSize:13,color:"#1a3260"}}>Enter your name and volunteer code to proceed.</div>
          <VolLookup volunteers={volunteers} onFound={v=>{setVol(v);setStep("details");}} submitLabel="Verify & Continue →"/>
        </>
      ):(
        <>
          <div style={{background:"#d4edda",border:"1px solid #b8ddc4",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:13,color:"#155724",display:"flex",alignItems:"center",gap:8}}><Ic n="check" size={15} color="#155724"/> Verified: <strong>{vol.name}</strong></div>
          <div style={{marginBottom:14}}><label style={lbl}>Event / Purpose *</label><input value={event} onChange={e=>setEvent(e.target.value)} placeholder="e.g. Cleansing Stream Seminar filming" style={inp}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            <div><label style={lbl}>Expected Return</label><input type="date" value={ret} onChange={e=>setRet(e.target.value)} style={inp}/></div>
            <div><label style={lbl}>Condition Out</label><select value={cond} onChange={e=>setCond(e.target.value)} style={inp}><option>Excellent</option><option>Good</option><option>Fair</option><option>Needs Attention</option></select></div>
          </div>
          <div style={{marginBottom:14}}><label style={lbl}>Notes</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} placeholder="Accessories, special handling…" style={{...inp,resize:"vertical"}}/></div>
          <label style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",background:"#d4edda",borderRadius:8,border:"1px solid #b8ddc4",cursor:"pointer",marginBottom:14}}>
            <input type="checkbox" checked={charged} onChange={e=>setCharged(e.target.checked)} style={{width:17,height:17,accentColor:"#0f1f3d"}}/>
            <span style={{fontSize:13,color:"#155724",fontWeight:500}}>Item is fully charged and ready.</span>
          </label>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setStep("auth")} style={{padding:"10px 16px",background:"transparent",color:"#aaa",border:"1px solid #ddd",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:1.5,cursor:"pointer"}}>← Back</button>
            <button onClick={()=>event.trim()&&charged&&onSubmit({volunteer:vol,event,returnDate:ret,condition:cond,notes})} disabled={!event.trim()||!charged} style={{flex:1,padding:"10px",background:event.trim()&&charged?"#0f1f3d":"#ddd",color:"#fff",border:"none",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:2,cursor:event.trim()&&charged?"pointer":"not-allowed"}}>Confirm Checkout</button>
          </div>
        </>
      )}
    </Modal>
  );
}

function CheckinModal({item,volunteers,onSubmit,onClose}){
  const [step,setStep]=useState("auth");
  const [vol,setVol]=useState(null);
  const [cond,setCond]=useState("Good");
  const [notes,setNotes]=useState("");
  return(
    <Modal title="Check In" subtitle={`${item.name} · ${item.id}`} onClose={onClose}>
      {step==="auth"?(
        <>
          <div style={{background:"#fff8e6",border:"1px solid #edd680",borderRadius:8,padding:"10px 14px",marginBottom:18,fontSize:13,color:"#7a5a00"}}>Out with <strong>{item.checkedOutTo}</strong>{item.checkedOutEvent?` — ${item.checkedOutEvent}`:""}</div>
          <div style={{background:"#f0f4ff",border:"1px solid #c8d8f8",borderRadius:8,padding:"10px 14px",marginBottom:18,fontSize:13,color:"#1a3260"}}>Enter your name and volunteer code to return this item.</div>
          <VolLookup volunteers={volunteers} onFound={v=>{setVol(v);setStep("details");}} submitLabel="Verify & Continue →"/>
        </>
      ):(
        <>
          <div style={{background:"#d4edda",border:"1px solid #b8ddc4",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:13,color:"#155724",display:"flex",alignItems:"center",gap:8}}><Ic n="check" size={15} color="#155724"/> Verified: <strong>{vol.name}</strong></div>
          <div style={{marginBottom:14}}><label style={lbl}>Condition on Return *</label><select value={cond} onChange={e=>setCond(e.target.value)} style={inp}><option>Excellent</option><option>Good</option><option>Fair</option><option>Needs Attention</option><option>Damaged</option></select></div>
          <div style={{marginBottom:18}}><label style={lbl}>Notes</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} placeholder="Any damage, missing parts, or notes for the AV Director…" style={{...inp,resize:"vertical"}}/></div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setStep("auth")} style={{padding:"10px 16px",background:"transparent",color:"#aaa",border:"1px solid #ddd",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:1.5,cursor:"pointer"}}>← Back</button>
            <button onClick={()=>onSubmit({volunteer:vol,condition:cond,notes})} style={{flex:1,padding:"10px",background:"#1a6b3a",color:"#fff",border:"none",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:2,cursor:"pointer"}}>Confirm Check In</button>
          </div>
        </>
      )}
    </Modal>
  );
}

function VolunteerView({equipment,log,volunteers,pEq,pLog,showToast}){
  const [modal,setModal]=useState(null);
  const [search,setSearch]=useState("");
  const [filt,setFilt]=useState("All");
  const cats=["All",...Array.from(new Set(equipment.map(e=>e.category)))];
  const filtered=equipment.filter(e=>(filt==="All"||e.category===filt)&&(e.name.toLowerCase().includes(search.toLowerCase())||e.id.toLowerCase().includes(search.toLowerCase())));
  const avail=equipment.filter(e=>e.status==="available").length;
  const out=equipment.filter(e=>e.status==="checked-out").length;

  const handleCheckout=({volunteer,event,returnDate,condition,notes})=>{
    const now=new Date().toISOString();
    pEq(equipment.map(e=>e.id===modal.item.id?{...e,status:"checked-out",checkedOutTo:volunteer.name,checkedOutCode:volunteer.code,checkedOutEvent:event,checkedOutDate:now,expectedReturn:returnDate}:e));
    pLog([{id:Date.now(),assetId:modal.item.id,assetName:modal.item.name,action:"checkout",who:volunteer.name,event,date:now,expectedReturn:returnDate,conditionOut:condition,conditionIn:null,returnDate:null,notes},...log]);
    setModal(null);showToast(`${modal.item.name} checked out to ${volunteer.name}.`);
  };
  const handleCheckin=({volunteer,condition,notes})=>{
    const now=new Date().toISOString();
    const match=log.find(l=>l.assetId===modal.item.id&&l.action==="checkout"&&!l.conditionIn);
    pEq(equipment.map(e=>e.id===modal.item.id?{...e,status:"available",checkedOutTo:null,checkedOutCode:null,checkedOutEvent:null,checkedOutDate:null,expectedReturn:null,condition}:e));
    if(match)pLog(log.map(l=>l===match?{...l,conditionIn:condition,returnDate:now,returnNotes:notes,returnedBy:volunteer.name}:l));
    else pLog([{id:Date.now(),assetId:modal.item.id,assetName:modal.item.name,action:"checkin",who:volunteer.name,event:modal.item.checkedOutEvent||"",date:now,conditionIn:condition,notes},...log]);
    setModal(null);showToast(`${modal.item.name} checked back in.`);
  };

  return(
    <div style={{maxWidth:1160,margin:"0 auto",padding:"36px 24px 80px"}}>
      <div style={{marginBottom:28}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:44,color:"#0f1f3d",letterSpacing:2,lineHeight:1}}>Equipment</div>
        <div style={{fontSize:13,color:"#7a7060",marginTop:4}}>Enter your name and volunteer code to check gear out or back in.</div>
        <div style={{display:"flex",gap:12,marginTop:16,flexWrap:"wrap"}}>
          {[{l:"Available",v:avail,c:"#155724",bg:"#d4edda"},{l:"Checked Out",v:out,c:"#856404",bg:"#fff3cd"},{l:"Total",v:equipment.length,c:"#1a3260",bg:"#dce8fb"}].map(p=>(
            <div key={p.l} style={{background:p.bg,borderRadius:8,padding:"8px 16px",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,color:p.c,lineHeight:1}}>{p.v}</span>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:p.c,letterSpacing:1.5}}>{p.l.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:22,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{position:"relative",flex:"1",minWidth:180}}>
          <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",opacity:.35}}><Ic n="search" size={14}/></span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{width:"100%",padding:"8px 12px 8px 34px",border:"1px solid #ddd8ce",borderRadius:8,fontSize:13,background:"#fff"}}/>
        </div>
        {cats.map(cat=>(
          <button key={cat} onClick={()=>setFilt(cat)} style={{padding:"7px 14px",borderRadius:20,border:"1.5px solid",borderColor:filt===cat?"#0f1f3d":"#ddd8ce",background:filt===cat?"#0f1f3d":"#fff",color:filt===cat?"#fff":"#777",fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:1.5,cursor:"pointer",whiteSpace:"nowrap"}}>{cat}</button>
        ))}
      </div>
      {filtered.length===0?<div style={{textAlign:"center",padding:"60px 0",color:"#bbb",fontSize:14}}>No equipment found.</div>:(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(285px,1fr))",gap:14}}>
          {filtered.map(item=>{
            const c=cs(item.category);const isOut=item.status==="checked-out";
            return(
              <div key={item.id} className="ch" style={{background:"#fff",border:"1px solid #e8e2d8",borderRadius:14,padding:22,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,width:4,height:"100%",background:c.bar,borderRadius:"4px 0 0 4px"}}/>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#aaa",background:"#f0ece4",padding:"3px 8px",borderRadius:4}}>{item.id}</span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,fontWeight:500,padding:"3px 10px",borderRadius:20,background:isOut?"#fff3cd":"#d4edda",color:isOut?"#856404":"#155724"}}>{isOut?"CHECKED OUT":"AVAILABLE"}</span>
                </div>
                <div style={{fontSize:16,fontWeight:600,color:"#0f1f3d",marginBottom:2}}>{item.name}</div>
                <div style={{fontSize:12,color:"#aaa",marginBottom:14,fontWeight:300}}>{item.make} · {item.category}</div>
                {isOut&&<div style={{background:"#fff8e6",border:"1px solid #edd680",borderRadius:8,padding:"8px 12px",marginBottom:12,fontSize:12}}><div style={{fontWeight:600,color:"#7a5a00"}}>{item.checkedOutTo}</div>{item.checkedOutEvent&&<div style={{color:"#a07800",marginTop:1}}>{item.checkedOutEvent}</div>}{item.expectedReturn&&<div style={{color:"#a07800",marginTop:1}}>Return by: {item.expectedReturn}</div>}</div>}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                  {[["Storage",item.storage||"—"],["Condition",item.condition||"—"]].map(([l,v])=>(
                    <div key={l}><div style={{fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:1.5,color:"#bbb",marginBottom:2}}>{l.toUpperCase()}</div><div style={{fontSize:12,color:"#333",fontWeight:500}}>{v}</div></div>
                  ))}
                </div>
                {isOut
                  ?<button onClick={()=>setModal({item,mode:"checkin"})} style={{width:"100%",padding:"10px",background:"#1a6b3a",color:"#fff",border:"none",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:1.5,cursor:"pointer"}}>↩  Check In</button>
                  :<button onClick={()=>setModal({item,mode:"checkout"})} style={{width:"100%",padding:"10px",background:"#0f1f3d",color:"#fff",border:"none",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:1.5,cursor:"pointer"}}>→  Checkout</button>
                }
              </div>
            );
          })}
        </div>
      )}
      {modal?.mode==="checkout"&&<CheckoutModal item={modal.item} volunteers={volunteers} onSubmit={handleCheckout} onClose={()=>setModal(null)}/>}
      {modal?.mode==="checkin"&&<CheckinModal item={modal.item} volunteers={volunteers} onSubmit={handleCheckin} onClose={()=>setModal(null)}/>}
    </div>
  );
}

function AdminLogin({onSuccess,onBack}){
  const [pin,setPin]=useState("");const [shake,setShake]=useState(false);const [err,setErr]=useState(false);
  const ADMIN_PIN="1234";
  const submit=()=>{if(pin===ADMIN_PIN){onSuccess();}else{setShake(true);setErr(true);setTimeout(()=>{setShake(false);setErr(false);},1500);setPin("");}};
  return(
    <div style={{minHeight:"calc(100vh - 59px)",display:"flex",alignItems:"center",justifyContent:"center",background:"#0f1f3d",padding:24}}>
      <div style={{background:"#fff",borderRadius:20,padding:"40px 36px 32px",width:"100%",maxWidth:320,boxShadow:"0 32px 80px rgba(0,0,0,.4)",textAlign:"center"}}>
        <div style={{width:48,height:48,background:"#f0f4ff",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><Ic n="shield" size={22} color="#1a3260"/></div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,color:"#0f1f3d",letterSpacing:3,marginBottom:4}}>Admin Access</div>
        <div style={{fontSize:13,color:"#aaa",marginBottom:28,fontWeight:300}}>Enter admin PIN</div>
        <div style={{marginBottom:14}}><CodeInput value={pin} onChange={setPin} shake={shake}/></div>
        {err&&<div style={{color:"#b91c1c",fontSize:12,marginBottom:10}}>Incorrect PIN.</div>}
        <button onClick={submit} disabled={pin.length<4} style={{width:"100%",padding:"12px",background:pin.length===4?"#0f1f3d":"#ddd",color:"#fff",border:"none",borderRadius:10,fontFamily:"'DM Mono',monospace",fontSize:12,letterSpacing:2,cursor:pin.length===4?"pointer":"not-allowed",marginBottom:10}}>Unlock</button>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#bbb",fontSize:13,cursor:"pointer"}}>← Back</button>
        <div style={{marginTop:20,fontFamily:"'DM Mono',monospace",fontSize:10,color:"#ddd"}}>Default PIN: 1234</div>
      </div>
    </div>
  );
}

function AdminView({equipment,log,counter,volunteers,pEq,pLog,pCt,pVol,showToast,onLogout}){
  const [tab,setTab]=useState("inventory");
  const [editItem,setEI]=useState(null);
  const [editVol,setEV]=useState(null);

  const forceReturn=id=>{pEq(equipment.map(e=>e.id===id?{...e,status:"available",checkedOutTo:null,checkedOutCode:null,checkedOutEvent:null,checkedOutDate:null,expectedReturn:null}:e));showToast("Item marked as returned.");};
  const deleteItem=id=>{pEq(equipment.filter(e=>e.id!==id));showToast("Item removed.");};
  const saveItem=item=>{
    if(item._new){const nc=counter+1,nid=`HC-${String(nc).padStart(3,"0")}`;const{_new,...rest}=item;pEq([...equipment,{...rest,id:nid,status:"available",checkedOutTo:null,checkedOutCode:null,checkedOutEvent:null,checkedOutDate:null,expectedReturn:null}]);pCt(nc);showToast(`${item.name} added as ${nid}.`);}
    else{pEq(equipment.map(e=>e.id===item.id?item:e));showToast(`${item.name} updated.`);}
    setEI(null);setTab("inventory");
  };
  const saveVol=vol=>{
    if(vol._new){const ids=volunteers.map(v=>parseInt(v.id.replace("V",""))||0);const nid=`V${String(Math.max(0,...ids)+1).padStart(3,"0")}`;if(volunteers.find(v=>v.code===vol.code)){showToast("That code is already assigned.","error");return;}const{_new,...rest}=vol;pVol([...volunteers,{...rest,id:nid}]);showToast(`${vol.name} added.`);}
    else{if(volunteers.find(v=>v.code===vol.code&&v.id!==vol.id)){showToast("That code is already taken.","error");return;}pVol(volunteers.map(v=>v.id===vol.id?vol:v));showToast(`${vol.name} updated.`);}
    setEV(null);setTab("volunteers");
  };
  const deleteVol=id=>{pVol(volunteers.filter(v=>v.id!==id));showToast("Volunteer removed.");};

  return(
    <div style={{maxWidth:1160,margin:"0 auto",padding:"32px 24px 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:3}}>
            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:"#0f1f3d",letterSpacing:2,lineHeight:1}}>Admin Panel</span>
            <span style={{background:"#c8992a",color:"#fff",fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,padding:"3px 8px",borderRadius:4}}>DIRECTOR</span>
          </div>
          <div style={{fontSize:13,color:"#7a7060"}}>Manage equipment · Assign volunteer codes · View checkout history</div>
        </div>
        <button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",background:"transparent",border:"1px solid #ddd",borderRadius:8,color:"#888",fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:1.5,cursor:"pointer"}}><Ic n="logout" size={13}/> Logout</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:24}}>
        {[{l:"Total Items",v:equipment.length,c:"#1a3260",bg:"#dce8fb"},{l:"Available",v:equipment.filter(e=>e.status==="available").length,c:"#155724",bg:"#d4edda"},{l:"Checked Out",v:equipment.filter(e=>e.status==="checked-out").length,c:"#856404",bg:"#fff3cd"},{l:"Active Volunteers",v:volunteers.filter(v=>v.active).length,c:"#5a3e8a",bg:"#ede8fb"}].map(s=>(
          <div key={s.l} style={{background:s.bg,borderRadius:10,padding:"14px 16px"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,color:s.c,lineHeight:1}}>{s.v}</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:s.c,letterSpacing:1.5,marginTop:2,opacity:.8}}>{s.l.toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:2,marginBottom:22,borderBottom:"2px solid #e8e2d8"}}>
        {[["inventory","Inventory"],["volunteers","Volunteers"],["log","Checkout Log"],["add","+ Add Equipment"]].map(([id,label])=>(
          <button key={id} onClick={()=>{setTab(id);if(id==="add")setEI({_new:true,name:"",category:"Camera",make:"",serial:"",storage:"",condition:"Good",notes:""});}} style={{padding:"9px 18px",border:"none",borderBottom:tab===id?"2px solid #0f1f3d":"2px solid transparent",background:"none",fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:1.5,color:tab===id?"#0f1f3d":"#aaa",cursor:"pointer",marginBottom:-2,whiteSpace:"nowrap"}}>{label.toUpperCase()}</button>
        ))}
      </div>

      {tab==="inventory"&&(
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:800}}>
            <thead><tr style={{borderBottom:"2px solid #0f1f3d"}}>{["Asset #","Name","Category","Make","Serial","Storage","Condition","Status",""].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:1.5,color:"#0f1f3d",fontWeight:500,whiteSpace:"nowrap"}}>{h.toUpperCase()}</th>)}</tr></thead>
            <tbody>{equipment.map((item,i)=>{const isOut=item.status==="checked-out";return(
              <tr key={item.id} className="rh" style={{borderBottom:"1px solid #ede8de",background:i%2===0?"#fff":"#faf8f4"}}>
                <td style={{padding:"9px 12px",fontFamily:"'DM Mono',monospace",fontSize:10,color:"#aaa"}}>{item.id}</td>
                <td style={{padding:"9px 12px",fontWeight:600,color:"#0f1f3d"}}>{item.name}</td>
                <td style={{padding:"9px 12px"}}><span style={{background:cs(item.category).bg,color:cs(item.category).chip,padding:"2px 8px",borderRadius:12,fontSize:11,fontFamily:"'DM Mono',monospace"}}>{item.category}</span></td>
                <td style={{padding:"9px 12px",color:"#666"}}>{item.make||"—"}</td>
                <td style={{padding:"9px 12px",fontFamily:"'DM Mono',monospace",fontSize:11,color:"#aaa"}}>{item.serial||<em style={{color:"#ddd"}}>—</em>}</td>
                <td style={{padding:"9px 12px",color:"#666"}}>{item.storage||"—"}</td>
                <td style={{padding:"9px 12px",color:"#666"}}>{item.condition}</td>
                <td style={{padding:"9px 12px"}}>{isOut?<span style={{fontFamily:"'DM Mono',monospace",fontSize:10,padding:"3px 9px",borderRadius:20,background:"#fff3cd",color:"#856404",whiteSpace:"nowrap"}}>OUT — {item.checkedOutTo}</span>:<span style={{fontFamily:"'DM Mono',monospace",fontSize:10,padding:"3px 9px",borderRadius:20,background:"#d4edda",color:"#155724"}}>IN</span>}</td>
                <td style={{padding:"9px 12px"}}><div style={{display:"flex",gap:4}}><button className="ib" onClick={()=>{setEI(item);setTab("add");}}><Ic n="edit" size={14} color="#264a8a"/></button>{isOut&&<button className="ib" onClick={()=>forceReturn(item.id)}><Ic n="check" size={14} color="#1a6b3a"/></button>}<button className="ib" onClick={()=>{if(window.confirm(`Remove ${item.name}?`))deleteItem(item.id);}}><Ic n="trash" size={14} color="#b91c1c"/></button></div></td>
              </tr>
            );})}</tbody>
          </table>
          {equipment.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"#bbb",fontSize:14}}>No equipment yet.</div>}
        </div>
      )}

      {tab==="volunteers"&&(
        <div>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
            <button onClick={()=>setEV({_new:true,name:"",code:"",role:"Volunteer",active:true})} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 18px",background:"#0f1f3d",color:"#fff",border:"none",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:1.5,cursor:"pointer"}}><Ic n="plus" size={13} color="#fff"/> Add Volunteer</button>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{borderBottom:"2px solid #0f1f3d"}}>{["ID","Name","Code","Role","Status",""].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:1.5,color:"#0f1f3d",fontWeight:500}}>{h.toUpperCase()}</th>)}</tr></thead>
            <tbody>{volunteers.map((vol,i)=>(
              <tr key={vol.id} className="rh" style={{borderBottom:"1px solid #ede8de",background:i%2===0?"#fff":"#faf8f4"}}>
                <td style={{padding:"9px 12px",fontFamily:"'DM Mono',monospace",fontSize:10,color:"#aaa"}}>{vol.id}</td>
                <td style={{padding:"9px 12px",fontWeight:600,color:"#0f1f3d"}}>{vol.name}</td>
                <td style={{padding:"9px 12px"}}><span style={{fontFamily:"'DM Mono',monospace",fontSize:14,letterSpacing:5,background:"#f0ece4",padding:"4px 12px",borderRadius:6,color:"#0f1f3d"}}>••••</span></td>
                <td style={{padding:"9px 12px",color:"#666"}}>{vol.role}</td>
                <td style={{padding:"9px 12px"}}><span style={{fontFamily:"'DM Mono',monospace",fontSize:10,padding:"3px 9px",borderRadius:20,background:vol.active?"#d4edda":"#f0ece4",color:vol.active?"#155724":"#888"}}>{vol.active?"ACTIVE":"INACTIVE"}</span></td>
                <td style={{padding:"9px 12px"}}><div style={{display:"flex",gap:4}}><button className="ib" onClick={()=>setEV(vol)}><Ic n="edit" size={14} color="#264a8a"/></button><button className="ib" onClick={()=>{pVol(volunteers.map(v=>v.id===vol.id?{...v,active:!v.active}:v));showToast(`${vol.name} ${vol.active?"deactivated":"activated"}.`);}}><Ic n={vol.active?"eyeoff":"eye"} size={14} color={vol.active?"#856404":"#1a6b3a"}/></button><button className="ib" onClick={()=>{if(window.confirm(`Remove ${vol.name}?`))deleteVol(vol.id);}}><Ic n="trash" size={14} color="#b91c1c"/></button></div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {tab==="log"&&(
        <div style={{overflowX:"auto"}}>
          {log.length===0?<div style={{textAlign:"center",padding:"60px 0",color:"#bbb",fontSize:14}}>No history yet.</div>:(
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,minWidth:900}}>
              <thead><tr style={{borderBottom:"2px solid #0f1f3d"}}>{["Date","Asset","Item","Action","Who","Event","Cond. Out","Cond. In","Returned"].map(h=><th key={h} style={{padding:"9px 12px",textAlign:"left",fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:1.5,color:"#0f1f3d",fontWeight:500,whiteSpace:"nowrap"}}>{h.toUpperCase()}</th>)}</tr></thead>
              <tbody>{log.map((e,i)=>(
                <tr key={e.id} className="rh" style={{borderBottom:"1px solid #ede8de",background:i%2===0?"#fff":"#faf8f4"}}>
                  <td style={{padding:"9px 12px",fontFamily:"'DM Mono',monospace",fontSize:11,color:"#aaa",whiteSpace:"nowrap"}}>{new Date(e.date).toLocaleDateString()}</td>
                  <td style={{padding:"9px 12px",fontFamily:"'DM Mono',monospace",fontSize:10,color:"#aaa"}}>{e.assetId}</td>
                  <td style={{padding:"9px 12px",fontWeight:500}}>{e.assetName}</td>
                  <td style={{padding:"9px 12px"}}><span style={{fontFamily:"'DM Mono',monospace",fontSize:10,padding:"3px 9px",borderRadius:20,background:e.action==="checkout"?"#fff3cd":"#d4edda",color:e.action==="checkout"?"#856404":"#155724"}}>{e.action==="checkout"?"OUT":"IN"}</span></td>
                  <td style={{padding:"9px 12px"}}>{e.who}</td>
                  <td style={{padding:"9px 12px",color:"#666",maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.event||"—"}</td>
                  <td style={{padding:"9px 12px",color:"#666"}}>{e.conditionOut||"—"}</td>
                  <td style={{padding:"9px 12px",color:"#666"}}>{e.conditionIn||<em style={{color:"#ccc"}}>pending</em>}</td>
                  <td style={{padding:"9px 12px",fontFamily:"'DM Mono',monospace",fontSize:11,color:"#aaa"}}>{e.returnDate?new Date(e.returnDate).toLocaleDateString():"—"}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      )}

      {tab==="add"&&editItem&&(
        <div style={{background:"#fff",border:"1px solid #e8e2d8",borderRadius:14,padding:28,maxWidth:660}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:"#0f1f3d",letterSpacing:2,marginBottom:22}}>{editItem._new?"Add New Equipment":`Edit — ${editItem.name}`}</div>
          <ItemForm item={editItem} onSave={saveItem} onCancel={()=>{setEI(null);setTab("inventory");}}/>
        </div>
      )}

      {editVol&&(
        <Modal title={editVol._new?"Add Volunteer":"Edit Volunteer"} subtitle={editVol._new?"Assign a unique 4-digit code":editVol.name} onClose={()=>setEV(null)}>
          <VolForm vol={editVol} onSave={saveVol} onCancel={()=>setEV(null)}/>
        </Modal>
      )}
    </div>
  );
}

function VolForm({vol,onSave,onCancel}){
  const [form,setForm]=useState({...vol});
  const [show,setShow]=useState(!!vol._new);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const valid=form.name.trim().length>1&&form.code.length===4;
  return(
    <div>
      <div style={{marginBottom:14}}><label style={lbl}>Full Name *</label><input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="First and last name" style={inp}/></div>
      <div style={{marginBottom:14}}><label style={lbl}>Role</label><select value={form.role} onChange={e=>set("role",e.target.value)} style={inp}>{["Volunteer","Lead Volunteer","AV Director","Staff"].map(r=><option key={r}>{r}</option>)}</select></div>
      <div style={{marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <label style={lbl}>4-Digit Checkout Code *</label>
          <button onClick={()=>setShow(s=>!s)} style={{background:"none",border:"none",color:"#aaa",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",gap:4}}><Ic n={show?"eyeoff":"eye"} size={13} color="#aaa"/>{show?"Hide":"Show"}</button>
        </div>
        {show?<input value={form.code} onChange={e=>set("code",e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="4 digits" maxLength={4} style={{...inp,textAlign:"center",fontSize:22,letterSpacing:8,fontFamily:"'DM Mono',monospace"}}/>:<CodeInput value={form.code} onChange={v=>set("code",v)} shake={false}/>}
        <div style={{fontSize:11,color:"#aaa",marginTop:6}}>Share privately with the volunteer. Must be unique.</div>
      </div>
      <label style={{display:"flex",alignItems:"center",gap:8,marginBottom:18,cursor:"pointer"}}><input type="checkbox" checked={form.active} onChange={e=>set("active",e.target.checked)} style={{width:16,height:16,accentColor:"#0f1f3d"}}/><span style={{fontSize:13,color:"#333"}}>Active — can check out equipment</span></label>
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>valid&&onSave(form)} disabled={!valid} style={{flex:1,padding:"11px",background:valid?"#0f1f3d":"#ddd",color:"#fff",border:"none",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:2,cursor:valid?"pointer":"not-allowed"}}>{vol._new?"Add Volunteer":"Save Changes"}</button>
        <button onClick={onCancel} style={{padding:"11px 18px",background:"transparent",color:"#888",border:"1px solid #ddd",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:1.5,cursor:"pointer"}}>Cancel</button>
      </div>
    </div>
  );
}

function ItemForm({item,onSave,onCancel}){
  const [form,setForm]=useState({...item});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const cats=["Camera","Lens","Battery / Charger","Tripod / Mount","Audio","Lighting","Other"];
  const valid=form.name.trim().length>0;
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div><label style={lbl}>Item Name *</label><input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Osmo Camera 4" style={inp}/></div>
        <div><label style={lbl}>Category</label><select value={form.category} onChange={e=>set("category",e.target.value)} style={inp}>{cats.map(c=><option key={c}>{c}</option>)}</select></div>
        <div><label style={lbl}>Make / Model</label><input value={form.make} onChange={e=>set("make",e.target.value)} placeholder="e.g. DJI Osmo Mobile 6" style={inp}/></div>
        <div><label style={lbl}>Serial Number</label><input value={form.serial} onChange={e=>set("serial",e.target.value)} placeholder="Fill in when available" style={inp}/></div>
        <div><label style={lbl}>Storage Location</label><input value={form.storage} onChange={e=>set("storage",e.target.value)} placeholder="e.g. Camera Bag A" style={inp}/></div>
        <div><label style={lbl}>Condition</label><select value={form.condition} onChange={e=>set("condition",e.target.value)} style={inp}><option>Excellent</option><option>Good</option><option>Fair</option><option>Needs Attention</option></select></div>
      </div>
      <div style={{marginBottom:18}}><label style={lbl}>Notes</label><textarea value={form.notes} onChange={e=>set("notes",e.target.value)} rows={2} placeholder="Accessories, paired items…" style={{...inp,resize:"vertical"}}/></div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>valid&&onSave(form)} disabled={!valid} style={{padding:"11px 28px",background:valid?"#0f1f3d":"#ddd",color:"#fff",border:"none",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:11,letterSpacing:2,cursor:valid?"pointer":"not-allowed"}}>{item._new?"Add to Inventory":"Save Changes"}</button>
        <button onClick={onCancel} style={{padding:"11px 18px",background:"transparent",color:"#888",border:"1px solid #ddd",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:1.5,cursor:"pointer"}}>Cancel</button>
      </div>
    </div>
  );
}

export default function App(){
  const [view,setView]=useState("volunteer");
  const [adminAuth,setAdminAuth]=useState(false);
  const [equipment,setEquipment]=useState([]);
  const [log,setLog]=useState([]);
  const [counter,setCounter]=useState(12);
  const [vols,setVols]=useState([]);
  const [loaded,setLoaded]=useState(false);
  const [toast,setToast]=useState(null);

  useEffect(()=>{(async()=>{
    setEquipment(await load(SK.equipment,defaultEquipment));
    setLog(await load(SK.log,[]));
    setCounter(await load(SK.counter,12));
    setVols(await load(SK.volunteers,defaultVolunteers));
    setLoaded(true);
  })();},[]);

  const pEq=async v=>{setEquipment(v);await save(SK.equipment,v);};
  const pLog=async v=>{setLog(v);await save(SK.log,v);};
  const pCt=async v=>{setCounter(v);await save(SK.counter,v);};
  const pVol=async v=>{setVols(v);await save(SK.volunteers,v);};
  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};

  if(!loaded)return<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0f1f3d",fontFamily:"'DM Sans',sans-serif",color:"rgba(255,255,255,.4)",fontSize:13,letterSpacing:3}}>LOADING…</div>;

  return(
    <div style={{minHeight:"100vh",background:"#f4f1eb",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box;margin:0;padding:0}input,select,textarea,button{font-family:inherit}input:focus,select:focus,textarea:focus{outline:2px solid #264a8a;outline-offset:1px}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#c8b89a;border-radius:3px}.ch{transition:box-shadow .2s,transform .2s}.ch:hover{box-shadow:0 6px 28px rgba(15,31,61,.12);transform:translateY(-2px)}.rh:hover{background:#faf7f2!important}.ib{background:none;border:none;cursor:pointer;padding:4px 6px;border-radius:6px;opacity:.6;transition:opacity .15s}.ib:hover{opacity:1}@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes mIn{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}`}</style>
      <div style={{background:"#0f1f3d",borderBottom:"3px solid #c8992a",position:"sticky",top:0,zIndex:200}}>
        <div style={{maxWidth:1160,margin:"0 auto",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
          <div style={{display:"flex",alignItems:"baseline",gap:12}}>
            <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#fff",letterSpacing:3}}>ProTeams</span>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#c8992a",letterSpacing:2}}>HARVEST CHURCH</span>
          </div>
          <div style={{display:"flex",gap:6}}>
            {[["volunteer","Equipment",null],["admin","Admin",<Ic n="shield" size={12}/>]].map(([id,label,icon])=>(
              <button key={id} onClick={()=>id==="admin"?(adminAuth?setView("admin"):setView("login")):setView(id)} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 14px",borderRadius:6,border:"none",background:(view===id||(id==="admin"&&view==="login"))?"rgba(200,153,42,.18)":"transparent",color:(view===id||(id==="admin"&&view==="login"))?"#c8992a":"rgba(255,255,255,.45)",fontFamily:"'DM Mono',monospace",fontSize:10,letterSpacing:2,cursor:"pointer"}}>{icon}{label}</button>
            ))}
          </div>
        </div>
      </div>
      {view==="volunteer"&&<VolunteerView equipment={equipment} log={log} volunteers={vols} pEq={pEq} pLog={pLog} showToast={showToast}/>}
      {view==="login"&&<AdminLogin onSuccess={()=>{setAdminAuth(true);setView("admin");}} onBack={()=>setView("volunteer")}/>}
      {view==="admin"&&adminAuth&&<AdminView equipment={equipment} log={log} counter={counter} volunteers={vols} pEq={pEq} pLog={pLog} pCt={pCt} pVol={pVol} showToast={showToast} onLogout={()=>{setAdminAuth(false);setView("volunteer");}}/>}
      {toast&&<div style={{position:"fixed",bottom:26,right:26,background:toast.type==="error"?"#b91c1c":"#0f1f3d",color:"#fff",padding:"13px 20px",borderRadius:10,fontSize:13,fontWeight:500,borderLeft:`4px solid ${toast.type==="error"?"#fca5a5":"#c8992a"}`,boxShadow:"0 8px 32px rgba(10,20,45,.3)",zIndex:9999,maxWidth:340,animation:"fadeUp .3s ease"}}>{toast.msg}</div>}
    </div>
  );
}
