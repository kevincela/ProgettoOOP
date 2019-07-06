import filterItem from './FilterItem.js';

let FilterForm = Vue.component('filter-form', {
	template: `
    <div>
        <p>Seleziona la logica su cui vuoi operare:</p>
        <div class="custom-control custom-radio custom-control-inline">
            <input class="custom-control-input" v-model="choice" value="0" type="radio" :id="'inlineRadio1' + id">
            <label class="custom-control-label" :for="'inlineRadio1' + id">AND</label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
            <input class="custom-control-input" v-model="choice" value="1" type="radio" :id="'inlineRadio2' + id">
            <label class="custom-control-label" :for="'inlineRadio2' + id">OR</label>
        </div>
        <div class="custom-control custom-radio custom-control-inline">
            <input class="custom-control-input" v-model="choice" value="2" type="radio" :id="'inlineRadio3' + id">
            <label class="custom-control-label" :for="'inlineRadio3' + id">Nessuna delle due</label>
        </div>
        <template v-for="(child, index) in children">
            <component @delete-filter="deleteFilter(index)" :is="child" :key="index"></component>
        </template>
        <div class="row mb-3">
            <div class="col-6">
                <button @click="addFilter" :disabled="choice == 2" class="btn btn-primary btn-block" type="button">Aggiungi un nuovo filtro</button>
            </div>
            <div class="col-6">
                <button :disabled="lastIndex == 0" @click="deleteFilter(lastIndex)" class="btn btn-danger btn-block" type="button">Elimina l'ultimo filtro</button>
            </div>
        </div>
    </div>
    `,
	data() {
		return {
			children: [ filterItem ],
			choice: '2',
			objToSubmit: {},
			id: null
		};
	},
	mounted() {
		this.id = this._uid;
	},
	methods: {
		addFilter() {
			this.children.push(filterItem);
		},
		deleteFilter(index) {
			this.children.splice(index, 1);
		},
		addFilterObj(child) {
			let obj = {};
			obj[child.field] = new Object();
			if (child.filtertype != '$bt') {
				obj[child.field][child.filtertype] = !isNaN(child.val) ? parseFloat(child.val) : child.val;
			} else {
				obj[child.field][child.filtertype] = [ parseFloat(child.minVal), parseFloat(child.maxVal) ];
			}
			return obj;
		},
		getFilterData() {
			switch (this.choice) {
				case '0':
					this.objToSubmit = new Object();
					this.objToSubmit['$and'] = [];
					for (let child of this.$children) {
						this.objToSubmit['$and'].push(this.addFilterObj(child));
					}
					break;
				case '1':
					this.objToSubmit = new Object();
					this.objToSubmit['$or'] = [];
					for (let child of this.$children) {
						this.objToSubmit['$or'].push(this.addFilterObj(child));
					}
					break;
				case '2':
					console.log(this.addFilterObj(this.$children[0]));
					this.objToSubmit = this.addFilterObj(this.$children[0]);
					break;
			}
			return this.objToSubmit;
		}
	},
	computed: {
		lastIndex() {
			return this.children.length - 1;
		}
	}
});

export default FilterForm;
