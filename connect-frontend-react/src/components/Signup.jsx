import React from "react";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../assets/js/api";

export default function Signup() {
  const [form, setForm] = useState({
    email: "", password: "", fullname: "", username: "", phone: "", location: "", profileImage: null
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    const { name, value, files } = e.target;
    
    if(name==="profileImage"){setForm(prev=>({...prev, profileImage:files[0]})); setPreview(URL.createObjectURL(files[0]));}
    else setForm(prev=>({...prev, [name]:value}));
  };

  useEffect(()=>()=>{if(preview) URL.revokeObjectURL(preview)}, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try{
      const formData = new FormData();
      Object.entries(form).forEach(([k,v])=>{if(k==="profileImage" && v) formData.append(k,v); else formData.append(k,v);});
      await api.post("/auth/signup", formData, { withCredentials:true, headers:{"Content-Type":"multipart/form-data"} });
      alert("Signup successful 🎉");
    }catch(err){console.error(err); alert("Signup failed");}finally{setLoading(false);}
  };

  return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"Inter, system-ui"}}>
      <div style={{flex:1,background:"linear-gradient(135deg, #667eea, #764ba2)", color:"#fff", display:"flex", flexDirection:"column", justifyContent:"center", padding:60}}>
        <h1 style={{fontSize:52, marginBottom:10}}>Connect</h1>
        <p style={{fontSize:22, lineHeight:1.5, opacity:0.9}}>Connect with people.<br/>Build real relationships.</p>
      </div>
      <div style={{flex:1,display:"flex",justifyContent:"center",alignItems:"center", background:"#f7f8fc"}}>
        <form style={{width:"100%", maxWidth:420, background:"#fff", padding:32, borderRadius:20, boxShadow:"0 25px 60px rgba(0,0,0,0.15)"}} onSubmit={handleSubmit}>
          <h2>Create Account</h2>
          <p style={{color:"#777", marginBottom:20}}>It only takes a minute ✨</p>
          <div style={{textAlign:"center", marginBottom:20}}>
            <img src={preview || "/default-avatar.png"} style={{width:110,height:110,borderRadius:"50%", objectFit:"cover", border:"3px solid #667eea"}}/>
            <label style={{display:"block", marginTop:8, fontSize:14, color:"#667eea", cursor:"pointer", fontWeight:600}}>
              Change Photo <input type="file" name="profileImage" accept="image/*" hidden onChange={handleChange}/>
            </label>
          </div>
          <div style={{display:"flex",gap:12}}>
            <input name="fullname" placeholder="Full Name" required style={{flex:1,padding:12,borderRadius:10,border:"1px solid #ccc"}} onChange={handleChange}/>
            <input name="username" placeholder="Username" required style={{flex:1,padding:12,borderRadius:10,border:"1px solid #ccc"}} onChange={handleChange}/>
          </div>
          <input type="email" name="email" placeholder="Email" required style={{width:"100%",padding:12,borderRadius:10,border:"1px solid #ccc",marginBottom:14}} onChange={handleChange}/>
          <input type="password" name="password" placeholder="Password" required style={{width:"100%",padding:12,borderRadius:10,border:"1px solid #ccc",marginBottom:14}} onChange={handleChange}/>
          <div style={{display:"flex",gap:12}}>
            <input name="phone" placeholder="Phone" style={{flex:1,padding:12,borderRadius:10,border:"1px solid #ccc"}} onChange={handleChange}/>
            <input name="location" placeholder="Location" style={{flex:1,padding:12,borderRadius:10,border:"1px solid #ccc"}} onChange={handleChange}/>
          </div>
          <button style={{width:"100%", padding:14, marginTop:10, background:"#667eea", border:"none", borderRadius:14, color:"#fff", fontSize:16, cursor:"pointer"}} disabled={loading}>{loading?"Creating...":"Create Account"}</button>
          <p style={{marginTop:18, textAlign:"center", fontSize:14}}>Already have an account? <Link to="/" style={{color:"#667eea", fontWeight:600, textDecoration:"none"}}>Login</Link></p>
        </form>
      </div>
    </div>
  );
}
