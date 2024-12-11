import Imiona from "./imiona.js";
import Nazwiska from "./nazwiska.js";

const LoginForm = {
    data() {
        return {
            username: '',
            password: '',
            error: ''
        };
    },
    /*
    template:`
        <div class="login-form">
            <h2>Login</h2>
            <form @submit.prevent="login">
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" v-model="username" class="form-control" id="username" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" v-model="password" class="form-control" id="password" required>
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
                <p v-if="error" class="text-danger">{{ error }}</p>
            </form>
        </div>
    `,*/
    template: /*html*/ `
    <div class="login-form">
            <h2>Login</h2>    
        <form @submit.prevent="Secure">
            <input type="hidden" name="nonce" id="nonce" value="<?php $_SESSION['nonce'] = sha1(uniqid());" />

            <div class="mb-3">
                <label for="user" class="form-label">Login</label>
                <input type="text" v-model="username" name="user" class="form-control" id="user" required>
            </div>
            <div class="mb-3">
                <label for="pass" class="form-label">Hasło</label>
                <input type="password" v-model="password" name="pass" class="form-control" id="pass" required>
            </div>
            <button type="submit" class="btn btn-primary">Prześlij</button>
            <p v-if="error" class="text-danger">{{ error }}</p>
        </form>
    </div>
    `,


    methods: {
        async Login() {
            // Send the login request to the server
            const response = await fetch('authenticate.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `user=${encodeURIComponent(this.username)}&pass=${encodeURIComponent(this.password)}`,
            });

            console.log(`user=${encodeURIComponent(this.username)}&pass=${encodeURIComponent(this.password)}`);

            const result = await response.json();


            console.log(result);

            if (result.authenticated) {
                this.$emit('authenticated', true);
            } else {
                this.error = 'Invalid username or password';
            }
        },

        async Secure(){
            var nonce = document.getElementById('nonce');
            var pass = document.getElementById('pass');
            // console.log("nounce: "+nonce.value);
            console.log("pass unsecure: "+pass.value);
            // var MD5 = new Hashes.MD5;
            // pass.value = MD5.hex(MD5.hex(pass.value) + nonce.value); 
            // console.log("pass secure: "+pass.value);
            this.password = pass.value;

            await this.Login();
        }
    }
};



const app = Vue.createApp({
	data() {
		return {
			isAuthenticated: false,
		};
	},
	components: {
		LoginForm,
		Imiona,
		Nazwiska,
	},
	methods: {
        handleAuthentication(status) {
            this.isAuthenticated = status;
        }
    }
});

app.mount("#app");
