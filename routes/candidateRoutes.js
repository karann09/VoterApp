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

    //voting
router.get('/vote/:candidateID', jwtAuthMiddleware, async (req, res)=>{
    // no admin can vote
    // user can only vote once
    
    candidateID = req.params.candidateID;
    userId = req.user.id;

    try{
        // Find the Candidate document with the specified candidateID
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'user not found' });
        }
        if(user.role == 'admin'){
            return res.status(403).json({ message: 'admin is not allowed'});
        }
        if(user.isVoted){
            return res.status(400).json({ message: 'You have already voted' });
        }

        // Update the Candidate document to record the vote
        candidate.votes.push({user: userId})
        candidate.voteCount++;
        await candidate.save();

        // update the user document
        user.isVoted = true
        await user.save();

        return res.status(200).json({ message: 'Vote recorded successfully' });
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
});
module.exports = router;