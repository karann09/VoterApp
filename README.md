voting application

what -> a fucntionality where user can give vote to the given set of candidate;

model ? 
Routes ? 

voting app functionality -> 

1. Sign in / Sign up
2. see the list of candidate
3. Vote only one of them
4. there is a route shows the list of candidate and their live vote countssorted by their vote counts
5. user data must contain their one unique govt id proof named : adhar card number
6. there should be one admin who can only maintain the table of candidate and   he can't able to vote at all
7. user can change their password
8. user can login only with aadhar number and password
9. Admin can't vote at all

------------------------------------------------------------

Routes 

User Authentication:
    /signup : POST - Create a new user account
    /login: POST - Login to an existing account

voting: 
    /candidates: GET - Get the list of candidates
    /vote/:candidateId: POST - Vote for a specific candidate

vote Counts: 
    /vote/counts: GET - GEt the list of candidate sorted byy their vote counts

User Profile: 
    /profile: GET - get user's information
    /profile/password: PUT - Change the user password

Admin Candidate Management:
    /candidate: POST - Create a new candidate
    /candidate/:candidateId: PUT - update an existing candidate
    /candidate/:candidateId: DELETE - Delete an existing candidate

![image](https://github.com/karann09/VoterApp/assets/126327364/1040211b-fa73-4279-88a3-8557c1740d17)

------------------------------------------------------------------------------
