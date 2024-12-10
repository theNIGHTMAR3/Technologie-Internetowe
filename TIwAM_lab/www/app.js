import Imiona from "./imiona.js";
import Nazwiska from "./nazwiska.js";

const app = Vue.createApp({
	components: {
		Imiona,
		Nazwiska,
	},
});

app.mount("#app");
