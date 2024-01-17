const queries={}

const mutations={
    createUser:async(
        _:any,
        { firstName, lastName, email, password }: { firstName: string; lastName: string; email: string; password: string }
        )=>{
        return 'random_id' 
    }
}

export const resolver={queries,mutations}