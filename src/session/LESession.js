import config from './config'

class LESession {
    constructor() {
        this.status = {
            refresh: {
                loginTime:null,
                refreshTimer:null,
            },
            session:null,
            err:null,
        }
    }

    isLoggedIn() {
        return ( this.status.session != null )
    }
    getCSRFToken() {
        return this.isLoggedIn() ? this.status.session.csrf : null
    }
    getBearer() {
        return this.isLoggedIn() ?  this.status.session.bearer : null
    }
    getCSDSDomain(action) {
        return this.status.session.csdsCollectionResponse[action]
    }

    async loginUser(username, password) {

        const myURL = `${config.loginDomain}/api/account/${process.env.VUE_APP_LE_ACCOUNT}/login?v=1.3`
  
        const reqContent = {
          method: "POST",
          headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Accept": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify({username, password})
        }

        const theReq = new Request(myURL, reqContent)

        await fetch(theReq) 
            .then ( async ( res ) => {    
                    const resp = await res.json()
                   if( res.ok ) {
                        this.status.session = resp
                        this.status.refresh.loginTime = new Date()

                        let tempMap = {}
                        resp.csdsCollectionResponse.baseURIs.forEach( (val) => {
                            tempMap[val.service] = val.baseURI
                        })

                        this.status.session.csdsCollectionResponse = tempMap

                        this.status.refresh.refreshTimer = setInterval( () =>{
                            this._refreshUser()   
                        }, config.refreshDelay)
        
                        await this._startAgentSession() 
                            .then ( async res => {    
                                const resp = await res.json()
                                if( res.ok ) {
                                    this.status.session.chatAPISession = resp.agentSessionLocation.link['@href']
                                } else {
                                    this.status.err = resp
                                }
                            })
                            .catch (err => {
                                    console.log(err)}
                            )   
                   } else {
                    this.status.err = resp
                   }
            })
            .catch (err => {
                    console.log(err)} ) 
                
        return new Promise( (res,rej) => { 
            this.status.err ? rej(this.status.err) : res(this.status.session)
        })


    }

    async _makeLERequest( url, method, body ) {

        const reqContent = {
          method: method,
          headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Accept": "application/json",
                "Authorization": "Bearer " + this.getBearer()
          },
          credentials: 'include',
          body: body
        }

        return await fetch(new Request(url, reqContent)) 
    }
        
    async _refreshUser() {

            const refresher = this.status.refresh
            //force reauth every 24 hours. 
            if( !this.isLoggedIn() ||  ( refresher.loginTime <=  refresher.loginTime.getDate() + 1 )) { 
                await this.logoutUser()
            } 

            const myURL = `${config.loginDomain}/api/account/${process.env.VUE_APP_LE_ACCOUNT}/refresh`

            await this._makeLERequest(myURL, "POST", JSON.stringify({csrf: this.getCSRFToken()}))
                .then ( async res => {
                    if (!res.ok) { await this.logoutUser()} 
                })
                .catch (async err => {console.log(err); await this.logoutUser()} ) 
    }

    async _startAgentSession() {
        const myURL = `${config.loginDomain}/api/account/${process.env.VUE_APP_LE_ACCOUNT}/agentSession?v=1&NC=true`
        return await this._makeLERequest(myURL, "POST", JSON.stringify({"loginData": ""})) 
    }

    async logoutUser() { // this will log out and cause the dashboard to no longer update, needs to dispatch and make a router push to the login page
        const myURL = `${config.loginDomain}/api/account/${process.env.VUE_APP_LE_ACCOUNT}/logout`
        return await this._makeLERequest(myURL, "POST", JSON.stringify({csrf: this.getCSRFToken()}))
    }

}

export default LESession