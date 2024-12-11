import Imiona from "./imiona.js";
import Nazwiska from "./nazwiska.js";

const LoginForm = {
    data() {
        return {
            username: '',
            password: '',
            error: '',
            nonce:''

        };
    },
    template: /*html*/ `
    <div class="login-form">
            <h2>Login</h2>    
        <form @submit.prevent="Secure">
            <input type="text" name="nonce" id="nonce" disabled />

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

    // metoda mounted jest uruchamiana przy starcie komponentu
	async mounted() {
        await this.GetNounce();
	},

    methods: {
        async GetNounce(){

            var json = await(await fetch('nonce.php')).json();

            // this.nounce = json?.nonce;
            this.nonce = json['nonce'];

            console.log(this.nounce);

            document.getElementById('nonce').value = this.nonce;

        },

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
            console.log("nounce: "+nonce.value);
            var MD5 = new Hashes.MD5;
            pass.value = MD5.hex(MD5.hex(pass.value) + nonce.value); 
            // pass.value = MD5.hex(pass.value); 
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
