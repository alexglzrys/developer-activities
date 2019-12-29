/**
 * Definir los cuatro pilares basicos para la creación de una Biblioteca de Administración de Estado Centralizado (VUEX)
 *
 * STATE, MUTATIONS, ACTIONS, GETTERS
 */

// Declaración del estado de la aplicación
const state = {
  notes: [],
  timestamps: []
};

// Definir las mutaciones encargadas de modificar el estado de la aplicación

// Las mutaciones siempre deben ser sincronas... para tareas asincronas, las acciones son responsables de gestionarlas antes de llamar a las mutaciones
const mutations = {
  // Las mutaciones siempre reciben el estado actual de la aplicación como primer argumento, y opcionalmente una carga util (datos) enviada desde las acciones que despachan los componentes
  ADD_NOTE(state, payload) {
    let newNote = payload;
    state.notes.push(newNote);
  },
  ADD_TIMESTAMP(state, payload) {
    let newTimeStamp = payload;
    state.timestamps.push(newTimeStamp);
  }
};

// Definir las acciones encargadas de llamar a las mutaciones

// Si existe la necesidad de realizar tareas o llamadas asincronas, es imporante realizarlas dentro del cuerpo de las acciones, pero, antes de llamar a las mutaciones
const actions = {
  // Las acciones siempre reciben el objeto de contexto como su primer argumeto. A través de el pueden acceder al estado, a los getters, así como llamar/confirmar mutaciones.  - Como segundo argumento opcional, reciben la carga util a pasar a las mutaciones
  addNote(context, payload) {
    // confirmar la mutación llamada ADD_NOTE y pasar la correspondiente carga util
    context.commit("ADD_NOTE", payload);
  },
  addTimestamp(context, payload) {
    context.commit("ADD_TIMESTAMP", payload);
  }
};

// Definir los getters encargados de extraer/computar/decorar información desde nuestro store
const getters = {
  // los getters siempre reciben el estado como su primer y unico argumento
  getNotes(state) {
    return state.notes;
  },
  getTimestamps(state) {
    return state.timestamps;
  },
  // Notación Arroy Function con return implicito
  getNoteCount: state => state.notes.length
};

/**
 * OBJETOS DE DEFINICIÓN DE COMPONENTES
 */

const inputComponent = {
  props: ["placeholder"],
  template: `<input 
                type="text" class="input is-small" 
                :placeholder="placeholder"
                v-model="input"
                @keyup.enter="monitorEnterKey"
            />`,
  data() {
    return {
      input: ""
    };
  },
  methods: {
    monitorEnterKey() {
      // Cuando el usuario ingresa una nota, requerimos enviar dos acciones para almacenar la nota y la fecha de envio.

      // Despachar acciones declaradas en el store registrado en la aplicación, así como enviar la carga util necesaria en cada acción
      this.$store.dispatch("addNote", this.input);
      this.$store.dispatch("addTimestamp", new Date().toLocaleString());

      // Resetear la entrada de la nota
      this.input = "";
    }
  }
};

const noteCountComponent = {
  template: `<div class="note-count">
    Número de actividades registradas: <strong>{{ noteCount }}</strong>
  </div>`,
  computed: {
    noteCount() {
      // Consultar en el store la cantidad de notas registradas para mostrarlas en la vista
      // Es importante declararlo en la sección de propiedades computadas, debido a que esta información puede cambiar de un momento a otro en el store.
      return this.$store.getters.getNoteCount;
    }
  }
};

/**
 * CREACIÓN DEL STORE
 */

// Con el estado, las mutaciones, las acciones y los captadores configurados
// la parte final de la integración con Vuex en nuestra app es crear e integrar la tienda (juntar todas las piezas).

// Crear e Integrar la tienda Vuex
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
});

new Vue({
  el: "#app",
  // INTEGRAR la tienda Vuex con la aplicación (su acceso es mediante this.$store)
  store,
  components: {
    inputComponent,
    noteCountComponent
  },
  data() {
    return {
      placeholder: "Ingrese una actividad para registrar..."
    };
  },
  computed: {
    notes() {
      // consultar el store para obtener las notas y mostrarlas en la vista
      return this.$store.getters.getNotes;
    },
    timestamps() {
      // consultar el store para obtener las marcas de tiempo y mostrarlas en la vista
      return this.$store.getters.getTimestamps;
    }
  }
});
