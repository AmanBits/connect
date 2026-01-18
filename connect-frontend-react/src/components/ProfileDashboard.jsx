import React from "react";

import { useEffect, useState } from "react";
import api from "../assets/js/api";

export default function ProfileDashboard() {
  const [edit, setEdit] = useState(false);
  const [profile, setProfile] = useState({
    fullname:"", username:"", bio:"", phone:"", location:"", profileImageUrl:"/default-avatar.png"
  });
  const [form, setForm] = useState(profile);
  const [preview, setPreview] = useState(profile.profileImageUrl);

  useEffect(()=>{
    const fetchProfile = async ()=>{
      try{
        const res = await api.get("/profile/me", {withCredentials:true});
        const data = res.data.data;
        const mapped = {
          fullname:data.fullname||data.name||"",
          username:data.username||"",
          bio:data.bio||"",
          phone:data.phone||"",
          location:data.location||data.city||"",
          profileImageUrl:data.imageUrl?`http://localhost:8080${data.imageUrl}`:"/default-avatar.png"
        };
        setProfile(mapped); setForm(mapped); setPreview(mapped.profileImageUrl);
      }catch(err){console.error(err);}
    };
    fetchProfile();
  }, []);

  const handleChange = (e)=>{
    const {name,value,files}=e.target;
    if(name==="profileImage"){setForm({...form,profileImageFile:files[0]}); setPreview(URL.createObjectURL(files[0]));}
    else setForm({...form,[name]:value});
  };

  const saveProfile = async ()=>{
    try{
      const formData = new FormData();
      formData.append("fullname", form.fullname);
      formData.append("username", form.username);
      formData.append("bio", form.bio);
      formData.append("phone", form.phone);
      formData.append("location", form.location);
      if(form.profileImageFile) formData.append("profileImage", form.profileImageFile);
      // await api.put("/profile/me", formData, {withCredentials:true, headers:{"Content-Type":"multipart/form-data"}});
      setProfile({...form,profileImageUrl:preview}); setEdit(false); alert("Profile updated (UI only)");
    }catch(err){console.error(err);}
  };

  return (
    <div style={{minHeight:"100vh", display:"flex", justifyContent:"center", alignItems:"flex-start", paddingTop:40, background:"#f4f6fb"}}>
      <div style={{width:380, background:"#fff", borderRadius:16, padding:24, boxShadow:"0 12px 30px rgba(0,0,0,0.12)", textAlign:"center"}}>
        <div style={{marginBottom:16, position:"relative"}}>
          <img src={preview} alt="Profile" style={{width:120,height:120,borderRadius:"50%", objectFit:"cover", border:"4px solid #eee"}}/>
          {edit && <label style={{display:"block", marginTop:8, fontSize:14, color:"#007bff", cursor:"pointer", fontWeight:600}}>Change Photo
            <input type="file" name="profileImage" accept="image/*" hidden onChange={handleChange}/>
          </label>}
        </div>

        {edit?<>
          <input name="fullname" value={form.fullname} onChange={handleChange} placeholder="Full Name" style={{width:"100%", padding:10, marginBottom:10, borderRadius:8, border:"1px solid #ccc"}}/>
          <input name="username" value={form.username} onChange={handleChange} placeholder="Username" style={{width:"100%", padding:10, marginBottom:10, borderRadius:8, border:"1px solid #ccc"}}/>
          <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Bio" style={{width:"100%", padding:10, marginBottom:10, borderRadius:8, border:"1px solid #ccc", resize:"none"}}/>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" style={{width:"100%", padding:10, marginBottom:10, borderRadius:8, border:"1px solid #ccc"}}/>
          <input name="location" value={form.location} onChange={handleChange} placeholder="Location" style={{width:"100%", padding:10, marginBottom:10, borderRadius:8, border:"1px solid #ccc"}}/>
          <div style={{display:"flex", gap:10}}>
            <button style={{flex:1,padding:10, background:"#28a745", color:"#fff", border:"none", borderRadius:10, cursor:"pointer"}} onClick={saveProfile}>Save</button>
            <button style={{flex:1,padding:10, background:"#6c757d", color:"#fff", border:"none", borderRadius:10, cursor:"pointer"}} onClick={()=>setEdit(false)}>Cancel</button>
          </div>
        </>:<>
          <h2>{profile.fullname}</h2>
          <p style={{color:"#777", marginTop:-6}}>{profile.username}</p>
          {profile.bio && <p style={{margin:"12px 0"}}>{profile.bio}</p>}
          <div style={{display:"flex", justifyContent:"space-between", fontSize:14, color:"#555", marginBottom:14}}>
            {profile.phone && <span>📞 {profile.phone}</span>}
            {profile.location && <span>📍 {profile.location}</span>}
          </div>
          <button style={{marginTop:14, padding:"10px 18px", background:"#007bff", color:"#fff", border:"none", borderRadius:10, cursor:"pointer", width:"100%"}} onClick={()=>setEdit(true)}>Edit Profile</button>
        </>}
      </div>
    </div>
  );
}
