export default {
	// komponent powinien mieć nazwę
	name: "Nazwiska",
	// dla atrybutów znacznika można określić typ i wartość domyślną
	props: {
		description: {
			type: String,
			default: "nazwiska w Polsce",
		},
	},
	// komponent może wykorzystywać inne komponenty
	components: {},
	// komponent musi mieć funkcję data() zwracającą wszystkie jego właściwości
	data() {
		return {
			names: [],
			filter: "",
			sortKey: "pozycja",
			sortOrder: 1,
		};
	},
	// komponent może mieć dowolne metody
	methods: {
		// pobranie danych zgodnie z filtrem
		async load() {
			const url = "nazwiska.php?filter=" + this.filter;
			const response = await fetch(url);
			this.names = await response.json();
		},
		// zmiana klucza i kierunku sortowania
		setSort(key) {
			this.sortKey = key;
			this.sortOrder = -this.sortOrder;
		},
	},

	// komponent może mieć obliczane właściwości np. posortowane albo przefiltrowane tablice
	// pamiętaj że metody .sort, .reverse itp. zmieniają oryginalną tablicę - lepiej użyć kopii [...arr] albo Array.from(arr)
	computed: {
		// posortowane rekordy nazwisk
		sortedNames() {
			return [...this.names].sort((a, b) => {
				// NOTE: jeśli jest konwertowanie porównania po polsku - sprawdzić dla np. Łukasz?
				if (this.sortKey === "nazwisko") {
					return (
						a.nazwisko.localeCompare(b.nazwisko, "pl-PL") * this.sortOrder
					);
				} else {
					if (this.sortKey)
						return (
							(a[this.sortKey] - b[this.sortKey]) * this.sortOrder
						);
					if (!this.sortKey) return this.sortOrder;
					return 0;
				}
			});
		},
	},

	// metoda mounted jest uruchamiana przy starcie komponentu
	async mounted() {
		await this.load();
	},

	// wzorzec wyglądu komponentu w HTML
	template: /*html*/ `
        <h3 class="text-center mt-3">{{description}}</h3>
        <div class="row">
            <label for="filter" class=" col-form-label col-sm-2 mb-2 text-end">Filter:</label>
            <div class="col-sm-10">
                <input type="text" id="filter" v-model="filter" @input="load" class="form-control" />
            </div>
        </div>

        <table class="table table-light table-striped table-sm table-hover">
            <thead>
                <tr class="table-primary">
                    <th @click="setSort('pozycja')" class="text-center">Pozycja</th>
                    <th @click="setSort('nazwisko')" class="text-center">Nazwisko</th>
                    <th @click="setSort('plec')" class="text-center">Płeć</th>
                    <th @click="setSort('liczba')" class="text-center">Liczba</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="x in sortedNames" >
                    <td class="text-center">{{x.pozycja}}</td>
                    <td>{{x.nazwisko}}</td>
                    <td class="text-center">{{x.plec}}</td>
                    <td class="text-center">{{x.liczba}}</td>
                </tr>
            </tbody>
        </table>
    `,
};
