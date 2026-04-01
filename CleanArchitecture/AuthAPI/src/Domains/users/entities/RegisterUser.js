class RegisterUser {
    constructor({username, password, fullname}) {

        // Check if the properties needed is available
        if(!username || !password || !fullname) {
            throw new Error("REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY");
        }

        // Check if the properties data type correct
        if (typeof username !== 'string' || typeof password !== 'string' || typeof fullname !== 'string') {
            throw new Error("REGISTER_USER.NOT_MEET_DATA_TYPE_SPESIFICATION")
        }

        // Check username length
        if(username.length>50){
            throw new Error("REGISTER_USER.USERNAME_LIMIT_CHAR");
        }

        // Check username mathc casses
        if(!username.match(/^[a-zA-Z1-9_]+$/)){
            throw new Error("REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER")
        }

        this.username = username;
        this.password = password;
        this.fullname = fullname;

    }
}

export default RegisterUser;
