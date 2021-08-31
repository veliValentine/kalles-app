const validateUser = (user) => {
    if(!user) throw new Error('No user given');
    if(!user.username) throw new Error('No username given');
};

export default validateUser;
