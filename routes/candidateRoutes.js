const express = require('express');
const router = express.Router();
const User = require('./../models/candidate');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');
const Candidate = require('./../models/candidate');

const checkAdminRole = async (userId) => {
    try{
        const user = await User.findById(userId);
        if(user.role === 'admin'){
            return true;
        }
    }catch(err){
        return false;
    }
}


//Candidate create Route
router.post('/',jwtAuthMiddleware, async (req, res)=> {
    try{
        if(! await checkAdminRole(req.user.id))
            return res.status(403).json({message: "User doesn't have admin role"});
        
        let data = req.body;
        const newCandidate = new Candidate(data);

        const response = await newCandidate.save();
        console.log('data saved');

        res.status(200).json({response: response});
    }catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal Server Error'});
    }
});


router.put('/:candidateId',jwtAuthMiddleware, async (req, res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: "User has no admin role"});
    const candidateId = req.params.candidateId;
    const updatedCandidateData = req.body;

    const response = await Candidate.findByIdAndUpdate(candidateId, updatedCandidateData, {
        new: true,
        runValidators: true,
    });
    
    if(!response){
        return res.status(403).json({error:'Candidate not found'});
    }
    console.log('Candidate Data Updated');
    res.status(200).json(response);
    } catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
    
});
router.delete('/:candidateId',jwtAuthMiddleware, async (req, res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: "User has no admin role"});
    const candidateId = req.params.candidateId;

    const response = await Candidate.findByIdAndDelete(candidateId);
    
    if(!response){
        return res.status(403).json({error:'Candidate not found'});
    }
    console.log('Candidate Data Deleted');
    res.status(200).json(response);
    } catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
    
});

module.exports = router;