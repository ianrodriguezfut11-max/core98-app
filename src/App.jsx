import { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";



// ─── DADOS ────────────────────────────────────────────────────────────────────
const USERS = [
  { id:1, nome:"Prof. Anderson Silva", email:"professor@fit.com", senha:"prof123",  role:"professor", avatar:"A", genero:"neutro" },
  { id:2, nome:"Carlos Mendes",        email:"carlos@fit.com",   senha:"aluno123", role:"aluno",     avatar:"C", genero:"m" },
  { id:3, nome:"Ana Paula Rocha",      email:"ana@fit.com",      senha:"aluno123", role:"aluno",     avatar:"A", genero:"f" },
  { id:4, nome:"Rodrigo Lima",         email:"rodrigo@fit.com",  senha:"aluno123", role:"aluno",     avatar:"R", genero:"m" },
];

const ALUNOS_INIT = [
  {
    id:2, nome:"Carlos Mendes", idade:28, altura:1.78, genero:"m",
    treino:"Hipertrofia", objetivo:"Ganhar massa muscular",
    avaliacoes:[
      {data:"2024-10",peso:98,gordura:28},{data:"2024-11",peso:95,gordura:26},
      {data:"2024-12",peso:92,gordura:24},{data:"2025-01",peso:89,gordura:22},
      {data:"2025-02",peso:87,gordura:20},{data:"2025-03",peso:84.5,gordura:18},
    ],
    meta:{peso:82,gordura:15},
    cargas:{
      "Supino Reto":       [{semana:"S1",carga:40,obs:""},{semana:"S2",carga:45,obs:"↑ Boa evolução"},{semana:"S3",carga:45,obs:""},{semana:"S4",carga:50,obs:"↑ Força ótima"},{semana:"S5",carga:52.5,obs:""},{semana:"S6",carga:55,obs:"↑ Recorde!"}],
      "Agachamento":       [{semana:"S1",carga:60,obs:""},{semana:"S2",carga:65,obs:"↑"},{semana:"S3",carga:70,obs:"↑ Técnica melhorou"},{semana:"S4",carga:70,obs:""},{semana:"S5",carga:75,obs:"↑"},{semana:"S6",carga:80,obs:"↑ Excelente!"}],
      "Levantamento Terra":[{semana:"S1",carga:70,obs:""},{semana:"S2",carga:75,obs:"↑"},{semana:"S3",carga:80,obs:"↑"},{semana:"S4",carga:85,obs:"↑"},{semana:"S5",carga:90,obs:"↑"},{semana:"S6",carga:95,obs:"↑ Superou meta!"}],
    },
  },
  {
    id:3, nome:"Ana Paula Rocha", idade:24, altura:1.65, genero:"f",
    treino:"Emagrecimento", objetivo:"Perder gordura e definir",
    avaliacoes:[
      {data:"2024-10",peso:72,gordura:32},{data:"2024-11",peso:70,gordura:30},
      {data:"2024-12",peso:68,gordura:28},{data:"2025-01",peso:66,gordura:26},
      {data:"2025-02",peso:64,gordura:24},{data:"2025-03",peso:62,gordura:22},
    ],
    meta:{peso:58,gordura:18},
    cargas:{
      "Leg Press":        [{semana:"S1",carga:80,obs:""},{semana:"S2",carga:90,obs:"↑"},{semana:"S3",carga:90,obs:""},{semana:"S4",carga:100,obs:"↑"},{semana:"S5",carga:110,obs:"↑"},{semana:"S6",carga:120,obs:"↑ Ótimo!"}],
      "Cadeira Extensora":[{semana:"S1",carga:20,obs:""},{semana:"S2",carga:22,obs:"↑"},{semana:"S3",carga:25,obs:"↑"},{semana:"S4",carga:25,obs:""},{semana:"S5",carga:27,obs:"↑"},{semana:"S6",carga:30,obs:"↑"}],
    },
  },
  {
    id:4, nome:"Rodrigo Lima", idade:35, altura:1.80, genero:"m",
    treino:"Força", objetivo:"Aumentar força máxima",
    avaliacoes:[
      {data:"2024-10",peso:82,gordura:20},{data:"2024-11",peso:82.5,gordura:19},
      {data:"2024-12",peso:83,gordura:18},{data:"2025-01",peso:83,gordura:17},
      {data:"2025-02",peso:84,gordura:16},{data:"2025-03",peso:84.5,gordura:15},
    ],
    meta:{peso:88,gordura:12},
    cargas:{
      "Supino Reto": [{semana:"S1",carga:90,obs:""},{semana:"S2",carga:95,obs:"↑"},{semana:"S3",carga:100,obs:"↑ Marco!"},{semana:"S4",carga:102.5,obs:"↑"},{semana:"S5",carga:105,obs:"↑"},{semana:"S6",carga:110,obs:"↑ PR!"}],
      "Agachamento": [{semana:"S1",carga:120,obs:""},{semana:"S2",carga:125,obs:"↑"},{semana:"S3",carga:130,obs:"↑"},{semana:"S4",carga:135,obs:"↑"},{semana:"S5",carga:140,obs:"↑"},{semana:"S6",carga:145,obs:"↑ Recorde!"}],
    },
  },
];

const MENSAGENS_INIT = [
  {id:1,de:"professor",para:2,tipo:"individual",texto:"Carlos, ótimo desempenho no supino hoje! Vamos aumentar a carga na próxima semana. 💪",hora:"08:30",data:"Hoje"},
  {id:2,de:"professor",para:2,tipo:"individual",texto:"Lembre de caprichar na hidratação antes do treino!",hora:"09:15",data:"Hoje"},
  {id:3,de:"professor",para:3,tipo:"individual",texto:"Ana, seu progresso está incrível! Continue assim, você está arrasando! 🔥",hora:"10:00",data:"Hoje"},
  {id:4,de:"professor",para:null,tipo:"geral",texto:"🏋️ Galera, semana que vem teremos avaliação física! Venham preparados.",hora:"11:00",data:"Hoje"},
  {id:5,de:"professor",para:4,tipo:"individual",texto:"Rodrigo, PR no agachamento essa semana foi demais! Você está voando! 🚀",hora:"14:00",data:"Ontem"},
  {id:6,de:"professor",para:null,tipo:"geral",texto:"📢 Turma: aula de sábado confirmada às 9h. Não faltem!",hora:"16:00",data:"Ontem"},
];

const TREINOS_INIT = [
  {alunoId:2,data:"Hoje",confirmado:null,treino:"Peito e Tríceps",    exercicios:["Supino Reto 4x8","Crucifixo 3x12","Tríceps Corda 4x15","Mergulho 3x10"]},
  {alunoId:3,data:"Hoje",confirmado:null,treino:"Pernas e Glúteos",   exercicios:["Leg Press 4x15","Agachamento 3x12","Cadeira Extensora 3x15","Glúteo na Polia 4x15"]},
  {alunoId:4,data:"Hoje",confirmado:null,treino:"Força — Full Body",  exercicios:["Agachamento 5x5","Supino Reto 5x5","Terra 5x3","Remada Curvada 4x6"]},
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const calcImc = (peso, altura) => (peso/(altura*altura)).toFixed(1);
const mesLabel = (s) => ({"2024-10":"Out","2024-11":"Nov","2024-12":"Dez","2025-01":"Jan","2025-02":"Fev","2025-03":"Mar"}[s]||s);
const imcInfo = (v) => {
  const n=parseFloat(v);
  if(n<18.5) return {label:"Abaixo do peso",color:"#7ab8f5"};
  if(n<25)   return {label:"Peso normal",   color:"#5ecba1"};
  if(n<30)   return {label:"Sobrepeso",     color:"#f0c050"};
  return           {label:"Obesidade",      color:"#f07070"};
};
const calcProg = (aluno) => {
  const ini=aluno.avaliacoes[0]?.peso||0;
  const atu=aluno.avaliacoes[aluno.avaliacoes.length-1]?.peso||0;
  const meta=aluno.meta.peso;
  if(ini===meta) return 100;
  return Math.min(100,Math.max(0,Math.round(Math.abs((ini-atu)/(ini-meta))*100)));
};
const pal = (genero) => {
  if(genero==="f") return {primary:"#e879a0",dim:"rgba(232,121,160,0.15)",light:"#f4a0c0",grad:"linear-gradient(135deg,#e879a0,#c2185b)",border:"rgba(232,121,160,0.3)"};
  if(genero==="m") return {primary:"#4a9eff",dim:"rgba(74,158,255,0.15)", light:"#82bcff",grad:"linear-gradient(135deg,#4a9eff,#1565c0)",border:"rgba(74,158,255,0.3)"};
  return                  {primary:"#ffffff",dim:"rgba(255,255,255,0.08)",light:"#cccccc",grad:"linear-gradient(135deg,#2a2a2a,#111111)",border:"rgba(255,255,255,0.2)"};
};

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const C={bg:"#080808",sur:"rgba(255,255,255,0.05)",bor:"rgba(255,255,255,0.1)",txt:"#f2f2f2",mut:"#555",sub:"#1a1a1a",red:"#ff6b6b"};
const card={background:C.sur,border:`1px solid ${C.bor}`,borderRadius:18,padding:"22px"};

const Tag=({color,children})=>(
  <span style={{display:"inline-block",padding:"3px 10px",borderRadius:20,background:`${color}20`,color,fontSize:11,fontWeight:700,letterSpacing:"0.5px",textTransform:"uppercase"}}>{children}</span>
);
const ChartTip=({active,payload,label})=>{
  if(!active||!payload?.length) return null;
  return(
    <div style={{background:"#111",border:`1px solid ${C.bor}`,borderRadius:10,padding:"10px 14px",fontSize:12}}>
      <p style={{color:C.mut,marginBottom:6,fontWeight:600}}>{label}</p>
      {payload.map((p,i)=><p key={i} style={{color:p.color||"#fff",margin:"2px 0"}}>{p.name}: <strong style={{color:C.txt}}>{p.value}kg</strong></p>)}
    </div>
  );
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({onLogin}){
  const [email,setEmail]=useState("");
  const [senha,setSenha]=useState("");
  const [erro,setErro]=useState("");
  const [loading,setLoad]=useState(false);
  const selUser=USERS.find(u=>u.email===email);
  const P=pal(selUser?.genero||"neutro");

  const doLogin=()=>{
    setLoad(true);
    setTimeout(()=>{
      const u=USERS.find(u=>u.email===email.trim()&&u.senha===senha);
      if(u) onLogin(u);
      else{setErro("E-mail ou senha incorretos");setLoad(false);}
    },600);
  };

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora','DM Sans',sans-serif"}}>
      <div style={{width:"100%",maxWidth:400,padding:"0 20px"}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{width:110,height:110,borderRadius:"50%",background:"linear-gradient(160deg,#1e1e1e,#0a0a0a)",border:"2px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",margin:"0 auto 16px",boxShadow:"0 0 40px rgba(255,255,255,0.06)"}}>
            <div style={{fontSize:36,fontWeight:900,color:"#fff",letterSpacing:"-4px",lineHeight:1}}>98</div>
            <div style={{fontSize:13,fontWeight:900,color:"#fff",letterSpacing:"5px",marginTop:2}}>CORE</div>
            <div style={{fontSize:7,color:"#888",letterSpacing:"1.5px",marginTop:1}}>FUNCIONAL & PERFORMANCE</div>
          </div>
          <h1 style={{fontSize:28,fontWeight:800,color:C.txt,margin:0,letterSpacing:"-1px"}}>98 Core</h1>
          <p style={{color:C.mut,marginTop:6,fontSize:14}}>Funcional & Performance</p>
        </div>

        <div style={{...card,borderRadius:22}}>
          <p style={{fontSize:13,color:C.mut,marginBottom:14}}>Acesso rápido:</p>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
            {USERS.map(u=>{
              const up=pal(u.genero); const sel=email===u.email;
              return(
                <button key={u.id} onClick={()=>{setEmail(u.email);setSenha(u.senha);setErro("");}} style={{padding:"10px 14px",borderRadius:12,cursor:"pointer",textAlign:"left",fontSize:13,display:"flex",alignItems:"center",gap:10,transition:"all 0.15s",border:`1px solid ${sel?up.border:C.bor}`,background:sel?up.dim:"transparent",color:sel?"#fff":C.mut}}>
                  <div style={{width:30,height:30,borderRadius:8,flexShrink:0,background:up.grad,border:`1px solid ${up.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",fontWeight:700}}>{u.avatar}</div>
                  <div>
                    <div style={{fontWeight:600,color:C.txt}}>{u.nome}</div>
                    <div style={{fontSize:11,color:C.mut}}>{u.role==="professor"?"👨‍🏫 Professor":"🏋️ Aluno"}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{borderTop:`1px solid ${C.bor}`,paddingTop:20}}>
            {[{label:"E-mail",val:email,set:setEmail,type:"email",ph:"seu@email.com"},{label:"Senha",val:senha,set:setSenha,type:"password",ph:"••••••••"}].map(f=>(
              <div key={f.label} style={{marginBottom:14}}>
                <label style={{fontSize:12,color:C.mut,display:"block",marginBottom:6,fontWeight:600}}>{f.label}</label>
                <input type={f.type} value={f.val} placeholder={f.ph} onChange={e=>{f.set(e.target.value);setErro("");}} onKeyDown={e=>e.key==="Enter"&&doLogin()}
                  style={{width:"100%",padding:"12px 14px",borderRadius:12,boxSizing:"border-box",border:`1px solid ${erro?C.red:C.bor}`,background:"rgba(255,255,255,0.03)",color:C.txt,fontSize:14,outline:"none"}}/>
              </div>
            ))}
            {erro&&<p style={{color:C.red,fontSize:13,margin:"0 0 12px"}}>⚠ {erro}</p>}
            <button onClick={doLogin} disabled={loading} style={{width:"100%",padding:"13px",borderRadius:12,border:`1px solid ${P.border}`,cursor:"pointer",background:P.grad,color:"#fff",fontWeight:800,fontSize:15,opacity:loading?0.7:1,transition:"all 0.3s"}}>
              {loading?"Entrando...":"Entrar →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ALUNO: ABA MENSAGENS ─────────────────────────────────────────────────────
function AlunoMensagens({user,mensagens,treinos,setTreinos,P}){
  const treinoHoje=treinos.find(t=>t.alunoId===user.id&&t.data==="Hoje");
  const msgs=mensagens.filter(m=>m.para===user.id||m.tipo==="geral");
  const confirmar=(val)=>{
    const treino=treinos.find(t=>t.alunoId===user.id&&t.data==="Hoje");
    if(treino?.id) dbConfirmarTreino(treino.id,val);
    setTreinos(prev=>prev.map(t=>t.alunoId===user.id&&t.data==="Hoje"?{...t,confirmado:val}:t));
  };

  return(
    <div>
      {treinoHoje&&(
        <div style={{...card,border:`1px solid ${P.border}`,background:P.dim,marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14,flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{fontSize:11,color:P.primary,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:4}}>Treino de Hoje</div>
              <div style={{fontSize:18,fontWeight:800,color:C.txt}}>{treinoHoje.treino}</div>
            </div>
            {treinoHoje.confirmado===null&&(
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>confirmar(true)} style={{padding:"8px 16px",borderRadius:10,border:"none",cursor:"pointer",background:"#22c55e",color:"#fff",fontWeight:700,fontSize:13}}>✅ Confirmei</button>
                <button onClick={()=>confirmar(false)} style={{padding:"8px 16px",borderRadius:10,border:`1px solid ${C.bor}`,cursor:"pointer",background:"transparent",color:C.mut,fontWeight:700,fontSize:13}}>❌ Não vou</button>
              </div>
            )}
            {treinoHoje.confirmado===true&&(
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",borderRadius:10,background:"rgba(34,197,94,0.15)",border:"1px solid rgba(34,197,94,0.3)"}}>
                <span>✅</span><span style={{color:"#22c55e",fontWeight:700,fontSize:13}}>Treino confirmado!</span>
              </div>
            )}
            {treinoHoje.confirmado===false&&(
              <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",borderRadius:10,background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)"}}>
                <span>❌</span><span style={{color:"#ef4444",fontWeight:700,fontSize:13}}>Falta registrada</span>
              </div>
            )}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {treinoHoje.exercicios.map((ex,i)=>(
              <div key={i} style={{padding:"6px 12px",borderRadius:8,background:"rgba(0,0,0,0.3)",border:`1px solid ${P.border}`,fontSize:12,color:C.txt}}>{ex}</div>
            ))}
          </div>
        </div>
      )}
      <div style={card}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>📬 Mensagens do Professor</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {msgs.length===0&&<div style={{textAlign:"center",color:C.mut,padding:"30px 0"}}>Nenhuma mensagem ainda.</div>}
          {msgs.map((m,i)=>(
            <div key={i} style={{padding:"14px 16px",borderRadius:14,background:m.tipo==="geral"?"rgba(255,255,255,0.04)":P.dim,border:`1px solid ${m.tipo==="geral"?C.bor:P.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,alignItems:"center"}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#2a2a2a,#111)",border:"1px solid rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff",fontWeight:700}}>P</div>
                  <span style={{fontSize:12,fontWeight:700,color:C.txt}}>Prof. Anderson</span>
                  {m.tipo==="geral"&&<span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:"rgba(255,255,255,0.08)",color:C.mut,fontWeight:600}}>📢 Geral</span>}
                </div>
                <span style={{fontSize:11,color:C.mut}}>{m.data} · {m.hora}</span>
              </div>
              <div style={{fontSize:14,color:C.txt,lineHeight:1.5}}>{m.texto}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PROF: ABA MENSAGENS ──────────────────────────────────────────────────────
function ProfMensagens({mensagens,setMensagens}){
  const [destino,setDestino]=useState("geral");
  const [texto,setTexto]=useState("");

  const enviar=()=>{
    if(!texto.trim()) return;
    const nova={
      para_id:destino==="geral"?null:destino,
      tipo:destino==="geral"?"geral":"individual",
      texto:texto.trim(),
      hora:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),
      data:"Hoje",
    };
    dbEnviarMensagem(nova);
    setMensagens(prev=>[{...nova,id:Date.now()},...prev]);
    setTexto("");
  };

  return(
    <div>
      <div style={{...card,marginBottom:20,border:"1px solid rgba(255,255,255,0.15)"}}>
        <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>✉️ Nova Mensagem</div>
        <div style={{marginBottom:14}}>
          <label style={{fontSize:11,color:C.mut,display:"block",marginBottom:5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Destinatário</label>
          <select value={destino} onChange={e=>setDestino(e.target.value)} style={{width:"100%",padding:"10px 13px",borderRadius:10,border:`1px solid ${C.bor}`,background:"#111",color:C.txt,fontSize:13,outline:"none"}}>
            <option value="geral">📢 Todos os alunos (Geral)</option>
            {USERS.filter(u=>u.role==="aluno").map(u=><option key={u.id} value={u.id}>{u.nome}</option>)}
          </select>
        </div>
        <textarea value={texto} onChange={e=>setTexto(e.target.value)} placeholder="Digite sua mensagem aqui..." rows={3}
          style={{width:"100%",padding:"12px 14px",borderRadius:10,boxSizing:"border-box",border:`1px solid ${C.bor}`,background:"rgba(255,255,255,0.03)",color:C.txt,fontSize:14,outline:"none",resize:"none",fontFamily:"inherit",marginBottom:12}}/>
        <button onClick={enviar} style={{padding:"10px 24px",borderRadius:10,border:"1px solid rgba(255,255,255,0.2)",cursor:"pointer",background:"linear-gradient(135deg,#2a2a2a,#111)",color:"#fff",fontWeight:700,fontSize:14}}>Enviar →</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={card}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>📢 Mensagens Gerais</div>
          <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:340,overflowY:"auto"}}>
            {mensagens.filter(m=>m.tipo==="geral").map((m,i)=>(
              <div key={i} style={{padding:"12px",borderRadius:12,background:"rgba(255,255,255,0.04)",border:`1px solid ${C.bor}`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:11,color:C.mut,fontWeight:600}}>Para todos</span>
                  <span style={{fontSize:11,color:C.mut}}>{m.data} · {m.hora}</span>
                </div>
                <div style={{fontSize:13,color:C.txt,lineHeight:1.5}}>{m.texto}</div>
              </div>
            ))}
            {!mensagens.filter(m=>m.tipo==="geral").length&&<div style={{color:C.mut,fontSize:13,textAlign:"center",padding:"20px 0"}}>Nenhuma mensagem geral.</div>}
          </div>
        </div>
        <div style={card}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>👤 Individuais</div>
          <div style={{display:"flex",flexDirection:"column",gap:14,maxHeight:340,overflowY:"auto"}}>
            {USERS.filter(u=>u.role==="aluno").map(u=>{
              const up=pal(u.genero);
              const msgs=mensagens.filter(m=>m.para===u.id);
              if(!msgs.length) return null;
              return(
                <div key={u.id}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <div style={{width:24,height:24,borderRadius:6,background:up.grad,border:`1px solid ${up.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#fff",fontWeight:800}}>{u.avatar}</div>
                    <span style={{fontSize:12,fontWeight:700,color:C.txt}}>{u.nome}</span>
                  </div>
                  {msgs.map((m,i)=>(
                    <div key={i} style={{padding:"10px 12px",borderRadius:10,background:up.dim,border:`1px solid ${up.border}`,marginBottom:6}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                        <span style={{fontSize:10,color:up.primary,fontWeight:600}}>Individual</span>
                        <span style={{fontSize:10,color:C.mut}}>{m.data} · {m.hora}</span>
                      </div>
                      <div style={{fontSize:12,color:C.txt,lineHeight:1.5}}>{m.texto}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROF: ABA TREINOS ────────────────────────────────────────────────────────
function ProfTreinos({alunos,treinos}){
  return(
    <div>
      <div style={{fontWeight:700,fontSize:15,marginBottom:20}}>🗓️ Status de Treinos — Hoje</div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {treinos.map((t,i)=>{
          const aluno=alunos.find(a=>a.id===t.alunoId);
          const u=USERS.find(u=>u.id===t.alunoId);
          if(!aluno||!u) return null;
          const p=pal(u.genero);
          return(
            <div key={i} style={{...card,border:`1px solid ${t.confirmado===true?"rgba(34,197,94,0.3)":t.confirmado===false?"rgba(239,68,68,0.3)":C.bor}`,background:t.confirmado===true?"rgba(34,197,94,0.05)":t.confirmado===false?"rgba(239,68,68,0.05)":C.sur}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:46,height:46,borderRadius:13,flexShrink:0,background:p.grad,border:`1px solid ${p.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"#fff"}}>{u.avatar}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:15,color:C.txt}}>{aluno.nome}</div>
                  <div style={{fontSize:12,color:C.mut,marginTop:2}}>{t.treino}</div>
                  <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                    {t.exercicios.map((ex,j)=><span key={j} style={{fontSize:11,padding:"3px 10px",borderRadius:8,background:p.dim,border:`1px solid ${p.border}`,color:p.primary}}>{ex}</span>)}
                  </div>
                </div>
                <div style={{textAlign:"center",flexShrink:0}}>
                  {t.confirmado===null  &&<div><div style={{fontSize:28}}>⏳</div><div style={{fontSize:11,color:C.mut,fontWeight:700,marginTop:4}}>Aguardando</div></div>}
                  {t.confirmado===true  &&<div><div style={{fontSize:28}}>✅</div><div style={{fontSize:11,color:"#22c55e",fontWeight:700,marginTop:4}}>Confirmado</div></div>}
                  {t.confirmado===false &&<div><div style={{fontSize:28}}>❌</div><div style={{fontSize:11,color:"#ef4444",fontWeight:700,marginTop:4}}>Falta</div></div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DASHBOARD ALUNO ──────────────────────────────────────────────────────────
function DashboardAluno({user,alunos,mensagens,treinos,setTreinos}){
  const aluno=alunos.find(a=>a.id===user.id);
  const [exAtivo,setExAtivo]=useState(Object.keys(aluno?.cargas||{})[0]||"");
  const [tab,setTab]=useState("overview");

  if(!aluno) return <div style={{color:C.mut,padding:40,textAlign:"center"}}>Perfil não encontrado.</div>;

  const P=pal(aluno.genero);
  const ult=aluno.avaliacoes[aluno.avaliacoes.length-1];
  const imcV=calcImc(ult.peso,aluno.altura);
  const imcI=imcInfo(imcV);
  const prog=calcProg(aluno);
  const pesos=aluno.avaliacoes.map(a=>({mes:mesLabel(a.data),peso:a.peso,gordura:a.gordura,meta:aluno.meta.peso}));
  const cargaAtual=aluno.cargas[exAtivo]||[];
  const msgCount=mensagens.filter(m=>(m.para===user.id||m.tipo==="geral")&&m.data==="Hoje").length;

  return(
    <div>
      {/* Tabs */}
      <div style={{display:"flex",gap:6,marginBottom:28,flexWrap:"wrap"}}>
        {[{id:"overview",label:"📊 Visão Geral"},{id:"corpo",label:"⚖️ Evolução Corporal"},{id:"cargas",label:"🏋️ Cargas"},{id:"mensagens",label:"💬 Mensagens"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 18px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:600,background:tab===t.id?P.grad:C.sur,color:tab===t.id?"#fff":C.mut,border:`1px solid ${tab===t.id?P.border:C.bor}`,transition:"all 0.2s",position:"relative"}}>
            {t.label}
            {t.id==="mensagens"&&msgCount>0&&tab!=="mensagens"&&(
              <span style={{position:"absolute",top:-4,right:-4,width:16,height:16,borderRadius:"50%",background:P.primary,color:"#111",fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{msgCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab==="overview"&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
            {[{label:"Peso atual",val:`${ult.peso}`,unit:"kg",icon:"⚖️",color:P.primary},{label:"Altura",val:`${aluno.altura}`,unit:"m",icon:"📏",color:P.light},{label:"IMC",val:imcV,unit:"",icon:"📊",color:imcI.color},{label:"% Gordura",val:`${ult.gordura}`,unit:"%",icon:"🔥",color:P.primary}].map((c,i)=>(
              <div key={i} style={{...card,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:-20,right:-20,width:70,height:70,borderRadius:"50%",background:`${c.color}12`}}/>
                <div style={{fontSize:22,marginBottom:10}}>{c.icon}</div>
                <div style={{fontSize:26,fontWeight:800,color:c.color}}>{c.val}<span style={{fontSize:13,color:C.mut,fontWeight:400}}>{c.unit}</span></div>
                <div style={{fontSize:11,color:C.mut,marginTop:3,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"}}>{c.label}</div>
              </div>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:20}}>
            <div style={card}>
              <div style={{fontSize:11,color:C.mut,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:14}}>Status IMC</div>
              <div style={{display:"flex",gap:4,marginBottom:12}}>
                {[{l:"Baixo",c:"#7ab8f5"},{l:"Normal",c:"#5ecba1"},{l:"Sobre",c:"#f0c050"},{l:"Obeso",c:"#f07070"}].map((b,i)=>{
                  const ranges=[18.5,25,30,99];const mins=[0,18.5,25,30];
                  const active=parseFloat(imcV)>=mins[i]&&parseFloat(imcV)<ranges[i];
                  return <div key={i} style={{flex:1,textAlign:"center"}}><div style={{height:6,borderRadius:3,background:active?b.c:`${b.c}25`,marginBottom:4}}/><div style={{fontSize:9,color:active?b.c:C.mut,fontWeight:600}}>{b.l}</div></div>;
                })}
              </div>
              <Tag color={imcI.color}>{imcI.label}</Tag>
              <div style={{fontSize:22,fontWeight:800,color:imcI.color,marginTop:8}}>{imcV}</div>
            </div>

            <div style={{...card,border:`1px solid ${P.border}`,background:P.dim}}>
              <div style={{fontSize:11,color:P.primary,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:14}}>Progresso da Meta</div>
              <div style={{fontSize:36,fontWeight:800,color:P.primary,lineHeight:1}}>{prog}<span style={{fontSize:18}}>%</span></div>
              <div style={{height:8,borderRadius:4,background:C.sub,overflow:"hidden",margin:"12px 0 8px"}}>
                <div style={{height:"100%",width:`${prog}%`,background:P.grad,borderRadius:4}}/>
              </div>
              <div style={{fontSize:12,color:C.mut}}>Faltam <strong style={{color:C.txt}}>{Math.abs(ult.peso-aluno.meta.peso).toFixed(1)}kg</strong> para {aluno.meta.peso}kg</div>
            </div>

            <div style={{...card,background:P.dim,border:`1px solid ${P.border}`}}>
              <div style={{fontSize:11,color:P.primary,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:14}}>Meu Objetivo</div>
              <div style={{fontSize:28,marginBottom:8}}>🎯</div>
              <div style={{fontSize:15,fontWeight:700,color:C.txt,marginBottom:6}}>{aluno.objetivo}</div>
              <Tag color={P.primary}>{aluno.treino}</Tag>
              <div style={{marginTop:12,fontSize:12,color:C.mut}}>Meta: <strong style={{color:C.txt}}>{aluno.meta.peso}kg</strong> · <strong style={{color:C.txt}}>{aluno.meta.gordura}%</strong> gordura</div>
            </div>
          </div>

          <div style={card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div><div style={{fontWeight:700,fontSize:15}}>Evolução do Peso</div><div style={{fontSize:12,color:C.mut}}>Últimos 6 meses</div></div>
              <div style={{display:"flex",gap:14,fontSize:12}}><span style={{color:P.primary}}>● Peso</span><span style={{color:"#888"}}>- - Meta</span></div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={pesos}>
                <defs><linearGradient id="pgA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={P.primary} stopOpacity={0.25}/><stop offset="100%" stopColor={P.primary} stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                <XAxis dataKey="mes" tick={{fill:C.mut,fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:C.mut,fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip content={<ChartTip/>}/>
                <ReferenceLine y={aluno.meta.peso} stroke="#888" strokeDasharray="5 4"/>
                <Area type="monotone" dataKey="peso" name="Peso" stroke={P.primary} strokeWidth={2.5} fill="url(#pgA)" dot={{fill:P.primary,r:4,strokeWidth:0}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* CORPO */}
      {tab==="corpo"&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={card}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>Peso (kg)</div>
              <div style={{fontSize:12,color:C.mut,marginBottom:20}}>Linha tracejada = meta</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={pesos}>
                  <defs><linearGradient id="pgB" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={P.primary} stopOpacity={0.3}/><stop offset="100%" stopColor={P.primary} stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                  <XAxis dataKey="mes" tick={{fill:C.mut,fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:C.mut,fontSize:11}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ChartTip/>}/>
                  <ReferenceLine y={aluno.meta.peso} stroke="#888" strokeDasharray="5 4"/>
                  <Area type="monotone" dataKey="peso" name="Peso" stroke={P.primary} strokeWidth={2.5} fill="url(#pgB)" dot={{fill:P.primary,r:4,strokeWidth:0}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={card}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>% Gordura</div>
              <div style={{fontSize:12,color:C.mut,marginBottom:20}}>Linha tracejada = meta</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={pesos}>
                  <defs><linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={P.light} stopOpacity={0.3}/><stop offset="100%" stopColor={P.light} stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                  <XAxis dataKey="mes" tick={{fill:C.mut,fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:C.mut,fontSize:11}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ChartTip/>}/>
                  <ReferenceLine y={aluno.meta.gordura} stroke="#888" strokeDasharray="5 4"/>
                  <Area type="monotone" dataKey="gordura" name="Gordura" stroke={P.light} strokeWidth={2.5} fill="url(#gA)" dot={{fill:P.light,r:4,strokeWidth:0}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{...card,marginTop:16}}>
            <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Histórico de Avaliações</div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{borderBottom:`1px solid ${C.bor}`}}>{["Período","Peso","% Gordura","IMC","Status"].map(h=><th key={h} style={{textAlign:"left",padding:"8px 10px",fontSize:11,color:C.mut,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>{h}</th>)}</tr></thead>
              <tbody>
                {[...aluno.avaliacoes].reverse().map((av,i)=>{
                  const iv=calcImc(av.peso,aluno.altura);const inf=imcInfo(iv);
                  return(<tr key={i} style={{borderBottom:`1px solid ${C.bor}`}}>
                    <td style={{padding:"10px",fontSize:13,color:C.txt,fontWeight:600}}>{mesLabel(av.data)}</td>
                    <td style={{padding:"10px",fontSize:13,color:P.primary}}>{av.peso} kg</td>
                    <td style={{padding:"10px",fontSize:13,color:P.light}}>{av.gordura}%</td>
                    <td style={{padding:"10px",fontSize:13,color:inf.color}}>{iv}</td>
                    <td style={{padding:"10px"}}><Tag color={inf.color}>{inf.label}</Tag></td>
                  </tr>);
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* CARGAS */}
      {tab==="cargas"&&(
        <>
          <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
            {Object.keys(aluno.cargas).map(ex=>(
              <button key={ex} onClick={()=>setExAtivo(ex)} style={{padding:"8px 16px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:600,background:exAtivo===ex?P.grad:C.sur,color:exAtivo===ex?"#fff":C.mut,border:`1px solid ${exAtivo===ex?P.border:C.bor}`}}>{ex}</button>
            ))}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div style={card}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>{exAtivo}</div>
              <div style={{fontSize:12,color:C.mut,marginBottom:20}}>Progressão semanal</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={cargaAtual} barSize={30}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                  <XAxis dataKey="semana" tick={{fill:C.mut,fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:C.mut,fontSize:11}} axisLine={false} tickLine={false} unit="kg"/>
                  <Tooltip content={<ChartTip/>}/>
                  <Bar dataKey="carga" name="Carga" fill={P.primary} radius={[6,6,0,0]} background={{fill:"rgba(255,255,255,0.025)",radius:[6,6,0,0]}}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={card}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Histórico</div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {cargaAtual.map((s,i)=>{
                  const prev=cargaAtual[i-1];const delta=prev?s.carga-prev.carga:0;
                  return(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:12,background:i===cargaAtual.length-1?P.dim:"rgba(255,255,255,0.03)",border:`1px solid ${i===cargaAtual.length-1?P.border:C.bor}`}}>
                      <div style={{fontSize:11,color:C.mut,fontWeight:700,width:24}}>{s.semana}</div>
                      <div style={{fontSize:16,fontWeight:800,color:C.txt,flex:1}}>{s.carga} kg</div>
                      {delta>0&&<Tag color={P.primary}>+{delta}kg</Tag>}
                      {delta<0&&<Tag color={C.red}>{delta}kg</Tag>}
                      {delta===0&&i>0&&<Tag color={C.mut}>=</Tag>}
                      {s.obs?<div style={{fontSize:11,color:P.primary}}>{s.obs}</div>:null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* MENSAGENS */}
      {tab==="mensagens"&&<AlunoMensagens user={user} mensagens={mensagens} treinos={treinos} setTreinos={setTreinos} P={P}/>}
    </div>
  );
}

// ─── DASHBOARD PROFESSOR ──────────────────────────────────────────────────────
function DashboardProfessor({alunos,setAlunos,mensagens,setMensagens,treinos,setTreinos}){
  const [tab,setTab]=useState("alunos");
  const [alunoSel,setAlunoSel]=useState(null);
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({});
  const alunoAtivo=alunos.find(a=>a.id===alunoSel);
  const PA=alunoAtivo?pal(alunoAtivo.genero):pal("neutro");

  const salvarAv=()=>{
    setAlunos(prev=>prev.map(a=>a.id!==alunoSel?a:{...a,avaliacoes:[...a.avaliacoes,{data:form.data,peso:parseFloat(form.peso),gordura:parseFloat(form.gordura)}]}));
    setModal(null);setForm({});
  };
  const salvarCarga=()=>{
    setAlunos(prev=>prev.map(a=>{
      if(a.id!==alunoSel) return a;
      const ex=form.exercicio;const lista=a.cargas[ex]||[];
      return{...a,cargas:{...a.cargas,[ex]:[...lista,{semana:`S${lista.length+1}`,carga:parseFloat(form.carga),obs:form.obs||""}]}};
    }));
    setModal(null);setForm({});
  };

  return(
    <div>
      <div style={{display:"flex",gap:6,marginBottom:28,flexWrap:"wrap"}}>
        {[{id:"alunos",label:"👥 Alunos"},{id:"detalhe",label:"📋 Detalhe do Aluno",disabled:!alunoSel},{id:"mensagens",label:"💬 Mensagens"},{id:"treinos",label:"🗓️ Treinos do Dia"}].map(t=>(
          <button key={t.id} onClick={()=>!t.disabled&&setTab(t.id)} disabled={t.disabled} style={{padding:"8px 18px",borderRadius:20,cursor:t.disabled?"default":"pointer",fontSize:13,fontWeight:600,background:tab===t.id?"linear-gradient(135deg,#2a2a2a,#111)":C.sur,color:tab===t.id?"#fff":t.disabled?C.sub:C.mut,border:`1px solid ${tab===t.id?"rgba(255,255,255,0.3)":C.bor}`,opacity:t.disabled?0.4:1}}>{t.label}</button>
        ))}
      </div>

      {/* LISTA ALUNOS */}
      {tab==="alunos"&&(
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:24}}>
            {[{label:"Alunos ativos",val:alunos.length,icon:"👥"},{label:"Média progresso",val:`${Math.round(alunos.reduce((s,a)=>s+calcProg(a),0)/alunos.length)}%`,icon:"📈"},{label:"Modalidades",val:new Set(alunos.map(a=>a.treino)).size,icon:"🏋️"}].map((c,i)=>(
              <div key={i} style={card}><div style={{fontSize:26,marginBottom:8}}>{c.icon}</div><div style={{fontSize:30,fontWeight:800,color:C.txt}}>{c.val}</div><div style={{fontSize:12,color:C.mut,marginTop:2}}>{c.label}</div></div>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {alunos.map((a,i)=>{
              const ult=a.avaliacoes[a.avaliacoes.length-1];const iv=calcImc(ult.peso,a.altura);const inf=imcInfo(iv);const prog=calcProg(a);const p=pal(a.genero);
              return(
                <div key={i} onClick={()=>{setAlunoSel(a.id);setTab("detalhe");}} style={{...card,display:"flex",alignItems:"center",gap:18,cursor:"pointer",border:`1px solid ${alunoSel===a.id?p.border:C.bor}`,background:alunoSel===a.id?p.dim:C.sur}}>
                  <div style={{width:50,height:50,borderRadius:14,flexShrink:0,background:p.grad,border:`1px solid ${p.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:"#fff"}}>{a.nome[0]}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:15,color:C.txt}}>{a.nome}</div>
                    <div style={{fontSize:12,color:C.mut}}>{a.treino} · {a.idade} anos</div>
                    <div style={{marginTop:8}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.mut,marginBottom:4}}><span>Progresso</span><span style={{color:p.primary}}>{prog}%</span></div>
                      <div style={{height:4,borderRadius:2,background:C.sub}}><div style={{height:"100%",width:`${prog}%`,background:p.grad,borderRadius:2}}/></div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:20,textAlign:"center"}}>
                    <div><div style={{fontSize:16,fontWeight:800,color:p.primary}}>{ult.peso}kg</div><div style={{fontSize:10,color:C.mut}}>Peso</div></div>
                    <div><div style={{fontSize:16,fontWeight:800,color:inf.color}}>{iv}</div><div style={{fontSize:10,color:C.mut}}>IMC</div></div>
                    <div><div style={{fontSize:16,fontWeight:800,color:p.light}}>{a.meta.peso}kg</div><div style={{fontSize:10,color:C.mut}}>Meta</div></div>
                  </div>
                  <div style={{color:C.mut,fontSize:18}}>›</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* DETALHE */}
      {tab==="detalhe"&&alunoAtivo&&(
        <>
          <div style={{...card,display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
            <div style={{width:56,height:56,borderRadius:16,background:PA.grad,border:`1px solid ${PA.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800,color:"#fff",flexShrink:0}}>{alunoAtivo.nome[0]}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:18,fontWeight:800,color:C.txt}}>{alunoAtivo.nome}</div>
              <div style={{fontSize:13,color:C.mut}}>{alunoAtivo.treino} · {alunoAtivo.idade} anos · {alunoAtivo.altura}m</div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{setModal("avaliacao");setForm({data:"2025-04"});}} style={{padding:"9px 16px",borderRadius:12,border:"none",cursor:"pointer",background:PA.grad,color:"#fff",fontWeight:700,fontSize:13}}>+ Avaliação</button>
              <button onClick={()=>{setModal("carga");setForm({exercicio:Object.keys(alunoAtivo.cargas)[0]});}} style={{padding:"9px 16px",borderRadius:12,border:`1px solid ${C.bor}`,cursor:"pointer",background:C.sur,color:C.txt,fontWeight:700,fontSize:13}}>+ Carga</button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
            <div style={card}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>Evolução do Peso</div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={alunoAtivo.avaliacoes.map(a=>({mes:mesLabel(a.data),peso:a.peso}))}>
                  <defs><linearGradient id="pdP" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={PA.primary} stopOpacity={0.3}/><stop offset="100%" stopColor={PA.primary} stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                  <XAxis dataKey="mes" tick={{fill:C.mut,fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:C.mut,fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ChartTip/>}/>
                  <ReferenceLine y={alunoAtivo.meta.peso} stroke="#888" strokeDasharray="4 4"/>
                  <Area type="monotone" dataKey="peso" name="Peso" stroke={PA.primary} strokeWidth={2} fill="url(#pdP)" dot={{fill:PA.primary,r:3,strokeWidth:0}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={card}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>% Gordura</div>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={alunoAtivo.avaliacoes.map(a=>({mes:mesLabel(a.data),gordura:a.gordura}))}>
                  <defs><linearGradient id="gdP" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={PA.light} stopOpacity={0.3}/><stop offset="100%" stopColor={PA.light} stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                  <XAxis dataKey="mes" tick={{fill:C.mut,fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:C.mut,fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<ChartTip/>}/>
                  <ReferenceLine y={alunoAtivo.meta.gordura} stroke="#888" strokeDasharray="4 4"/>
                  <Area type="monotone" dataKey="gordura" name="Gordura" stroke={PA.light} strokeWidth={2} fill="url(#gdP)" dot={{fill:PA.light,r:3,strokeWidth:0}}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          {Object.entries(alunoAtivo.cargas).map(([ex,lista])=>(
            <div key={ex} style={{...card,marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>{ex}</div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={lista} barSize={26}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                  <XAxis dataKey="semana" tick={{fill:C.mut,fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:C.mut,fontSize:10}} axisLine={false} tickLine={false} unit="kg"/>
                  <Tooltip content={<ChartTip/>}/>
                  <Bar dataKey="carga" name="Carga" fill={PA.primary} radius={[5,5,0,0]} background={{fill:"rgba(255,255,255,0.025)",radius:[5,5,0,0]}}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
        </>
      )}

      {tab==="mensagens"&&<ProfMensagens mensagens={mensagens} setMensagens={setMensagens}/>}
      {tab==="treinos"&&<ProfTreinos alunos={alunos} treinos={treinos}/>}

      {/* MODAL AVALIAÇÃO */}
      {modal==="avaliacao"&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}>
          <div style={{...card,width:360,borderRadius:22}}>
            <div style={{fontWeight:800,fontSize:17,marginBottom:20}}>Nova Avaliação</div>
            {[{label:"Mês/Ano (AAAA-MM)",key:"data",ph:"2025-04"},{label:"Peso (kg)",key:"peso",ph:"85.0"},{label:"% Gordura",key:"gordura",ph:"20"}].map(f=>(
              <div key={f.key} style={{marginBottom:14}}>
                <label style={{fontSize:12,color:C.mut,display:"block",marginBottom:5,fontWeight:600}}>{f.label}</label>
                <input value={form[f.key]||""} placeholder={f.ph} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} style={{width:"100%",padding:"11px 13px",borderRadius:10,boxSizing:"border-box",border:`1px solid ${C.bor}`,background:"rgba(255,255,255,0.04)",color:C.txt,fontSize:14,outline:"none"}}/>
              </div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button onClick={()=>setModal(null)} style={{flex:1,padding:11,borderRadius:10,border:`1px solid ${C.bor}`,background:"transparent",color:C.mut,cursor:"pointer",fontWeight:600}}>Cancelar</button>
              <button onClick={salvarAv} style={{flex:1,padding:11,borderRadius:10,border:"none",background:"#fff",color:"#111",cursor:"pointer",fontWeight:800}}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CARGA */}
      {modal==="carga"&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}}>
          <div style={{...card,width:380,borderRadius:22}}>
            <div style={{fontWeight:800,fontSize:17,marginBottom:20}}>Registrar Carga</div>
            <div style={{marginBottom:14}}>
              <label style={{fontSize:12,color:C.mut,display:"block",marginBottom:5,fontWeight:600}}>Exercício</label>
              <select value={form.exercicio||""} onChange={e=>setForm(p=>({...p,exercicio:e.target.value}))} style={{width:"100%",padding:"11px 13px",borderRadius:10,border:`1px solid ${C.bor}`,background:"#111",color:C.txt,fontSize:14,outline:"none"}}>
                {Object.keys(alunoAtivo?.cargas||{}).map(ex=><option key={ex} value={ex}>{ex}</option>)}
              </select>
            </div>
            {[{label:"Carga (kg)",key:"carga",ph:"60"},{label:"Observação",key:"obs",ph:"↑ Boa progressão!"}].map(f=>(
              <div key={f.key} style={{marginBottom:14}}>
                <label style={{fontSize:12,color:C.mut,display:"block",marginBottom:5,fontWeight:600}}>{f.label}</label>
                <input value={form[f.key]||""} placeholder={f.ph} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} style={{width:"100%",padding:"11px 13px",borderRadius:10,boxSizing:"border-box",border:`1px solid ${C.bor}`,background:"rgba(255,255,255,0.04)",color:C.txt,fontSize:14,outline:"none"}}/>
              </div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button onClick={()=>setModal(null)} style={{flex:1,padding:11,borderRadius:10,border:`1px solid ${C.bor}`,background:"transparent",color:C.mut,cursor:"pointer",fontWeight:600}}>Cancelar</button>
              <button onClick={salvarCarga} style={{flex:1,padding:11,borderRadius:10,border:"none",background:"#fff",color:"#111",cursor:"pointer",fontWeight:800}}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);
  const [alunos,setAlunos]=useState(ALUNOS_INIT);
  const [mensagens,setMensagens]=useState(MENSAGENS_INIT);
  const [treinos,setTreinos]=useState(TREINOS_INIT);

  if(!user) return <Login onLogin={setUser}/>;

  const initials=user.nome.split(" ").map(n=>n[0]).slice(0,2).join("");
  const UP=pal(user.genero);

  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Sora','DM Sans',sans-serif",color:C.txt}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 28px",borderBottom:`1px solid ${C.bor}`,background:"rgba(8,8,8,0.95)",backdropFilter:"blur(16px)",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:38,height:38,borderRadius:11,background:"linear-gradient(135deg,#1e1e1e,#0a0a0a)",border:"2px solid rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
            <div style={{fontSize:11,fontWeight:900,color:"#fff",letterSpacing:"-1px",lineHeight:1}}>98</div>
            <div style={{fontSize:7,fontWeight:900,color:"#fff",letterSpacing:"1px"}}>CORE</div>
          </div>
          <div>
            <div style={{fontWeight:800,fontSize:16,letterSpacing:"-0.5px"}}>98 Core</div>
            <div style={{fontSize:11,color:C.mut}}>{user.role==="professor"?"👨‍🏫 Painel do Professor":"🏋️ Painel do Aluno"}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:14,fontWeight:700}}>{user.nome.split(" ")[0]}</div>
            <div style={{fontSize:11,color:C.mut}}>{user.role==="professor"?"Professor":"Aluno"}</div>
          </div>
          <div style={{width:38,height:38,borderRadius:11,background:UP.grad,border:`1px solid ${UP.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:800,color:"#fff"}}>{initials}</div>
          <button onClick={()=>setUser(null)} style={{padding:"7px 14px",borderRadius:10,border:`1px solid ${C.bor}`,background:"transparent",color:C.mut,cursor:"pointer",fontSize:12,fontWeight:600}}>Sair</button>
        </div>
      </div>

      <div style={{padding:"28px",maxWidth:960,margin:"0 auto"}}>
        <div style={{marginBottom:28}}>
          <h1 style={{fontSize:24,fontWeight:800,margin:0,letterSpacing:"-0.7px"}}>
            {user.role==="professor"?`Olá, Prof. ${user.nome.split(" ")[1]}! 👋`:`Bom treino, ${user.nome.split(" ")[0]}! 💪`}
          </h1>
          <p style={{color:C.mut,marginTop:5,fontSize:14}}>
            {user.role==="professor"?`Gerencie seus ${alunos.length} alunos`:"Acompanhe sua evolução"}
          </p>
        </div>
        {user.role==="aluno"
          ?<DashboardAluno user={user} alunos={alunos} mensagens={mensagens} treinos={treinos} setTreinos={setTreinos}/>
          :<DashboardProfessor alunos={alunos} setAlunos={setAlunos} mensagens={mensagens} setMensagens={setMensagens} treinos={treinos} setTreinos={setTreinos}/>
        }
      </div>
    </div>
  );
}
