import jwt from "jsonwebtoken";
import {db} from "../../lib/firebase";
import {checkEmotionGuardrails} from "../../lib/emotionGuardrails";
export default async function handler(req,res){try{const token=req.headers.authorization?.substring(7);const decoded=jwt.verify(token,process.env.JWT_SECRET);const logs=await db.collection("reflections").where("userId","==",decoded.userId).limit(30).get();const alerts=checkEmotionGuardrails(logs.docs.map(d=>d.data()));return res.json({success:true,alerts})}catch(e){return res.status(500).json({error:e.message})}}
