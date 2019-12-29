## App Notas
### Vuex
Vuex es una biblioteca que implementa del patrón de diseño FLUX de Facebook para la **Admistración de Estado Centralizado** en VueJS.

Basicamente el patrón de diseño FLUX se compone de cuatro partes organizadas como una tubería de datos unidireccional

1. La vista despacha acciones que describen que es lo que sucedió. (Por ejemplo: operación CRUD)
2. El store (almacén) recibe estas acciones y determina que cambios deberían ocurrir, esto lo hace a través de la confirmación (commit) de una mutación.
3. Las mutaciones son el único mecanismo para modificar el estado declarado en el store, es decir, internamente se declara la lógica necesaria para que estos cambios sucedan.
4. Después de que el estado se actualiza, los cambios son empujados nuevamente a la vista para que sean renderizados

### Resumen Técnico
Además de desacoplar el manejo de la interacción y los cambios de estado, Flux también brinda los siguientes beneficios:
- Flux nos permite dividir naturalmente la gestión del estado en partes aisladas, más pequeñas y comprobables.
- Los componentes son más simples, puesto que al separar la administración del estado de forma externa, los componentes Vue se convierten en simples funciones de representación HTML. **Esto hace que sean más pequenos, fáciles de entender y componer.**
- Podemos decorar el estado antes de presentarlo en la vista del componente, sin que sea necesario mostrar el valor real almacenado.

Flux es un patrón de diseño, no una biblioteca o implementación específica.

Desde que Facebook comenzó a compartir Flux con la comunidad opensource, la comunidad ha respondido escribiendo toneladas de diferentes implementaciones de Flux.

Dentro de la comunidad de Vue, **Vuex es la biblioteca de administración de estado más utilizada**, proporcionando las siguientes ideas clave:

- Todos los datos de nuestra aplicación se encuentran en una única estructura de datos llamada estado, que se almacena en el store.
- Nuestra aplicación lee el estado declarado en el store.
- El estado nunca se muta directamente fuera del store.
- Las vistas despachan acciones, las cuales describen lo que sucedió.
- Las acciones confirman mutaciones.
- Las mutaciones mutan / cambian directamente el estado declarado en el store.
- Cuando el estado está mutado, los componentes / vistas relevantes se vuelven a renderizar.
---

**Nota importante:** Al igual que Vue difiere de React, *Vuex difiere de Redux al mutar el estado directamente en lugar de hacer que el estado sea inmutable y reemplazarlo por completo.* Esta idea se vincula con la capacidad de Vue de comprender automáticamente qué componentes deben volver a representarse cuando se cambia el estado.

---

**Vuex viene con un boleirplate robusto que puede no ser necesario para todas las aplicaciones.** Sin embargo, una vez que superamos el obstáculo inicial de configurar Vuex, existen numerosos beneficios que superan en mucho al patrón de gestion de estado simple. (un simple objeto con data y funciones para su modificación)

**El corazón de una implementación de Vuex es la tienda de Vuex**. La tienda es donde se guardan los datos de la aplicación (es decir, el estado).

Vuex introduce 4 pilares fundamentales para la gestión del store.

- state
- mutations
- actions
- getters

---
**State**
Para crear el estado de una aplicación, es importante comprender y segregar el nivel de componente y los datos de nivel de aplicación. Los datos de nivel de aplicación son los datos que deben compartirse entre los componentes; en este caso, el estado.

```
const state = {
  notes: [],
  teachers: [],
  title: ''
}
```

**Mutations**
Cuando se habla de cambios en el estado, nos referimos a mutaciones. En este sentido, se tratan de funciones encargadas de realizar cambios en el estado de la tienda

Cuando se ejecuta la función de mutación, el primer argumento pasado es el estado.

Además, cuando una acción llama a una mutación, puede o no pasar una carga útil (datos), los cuales, en algunos casos podemos ignorar con toda seguridad.

```
const mutations = {
  ADD_NOTE(state, payload) {
    state.notes.push(payload)
  },
  ADD_TITLE(state, payload) {
    state.title = payload
  }
}
```

*Es importante recordar que las mutaciones tienen que ser sincrónicas. Si es necesario realizar tareas asincrónicas, las acciones son responsables de tratarlas antes de llamar a las mutaciones.*

**Acciones**
Las acciones son funciones que existen para llamar a las mutaciones. Además, las acciones pueden llevar a cabo la gestion de llamadas con tareas asíncronas antes de confirmar (invocar) las mutaciones.

Las acciones siempre reciben el objeto de contexto como su primer argumeto. A través de él pueden acceder al estado, a los getters, así como llamar/confirmar mutaciones.

Como segundo argumento opcional, reciben la carga util a pasar a las mutaciones.
```
const actions = {
  addNotes(context, payload) {
    context.commit('ADD_NOTE', payload)
  },
  addTitle(context, payload) {
    context.commit('ADD_TITLE', payload)
  }
}
```

**Getters**
Son similares a las propiedades computadas declaradas en los componentes. Su función es obtener/decorar información derivada del estado actual declarado en el store.

Podemos llamarlos varias veces en nuestras acciones y en nuestros componentes.

Practicamente no son necesarios al trabajar con Vuex ya que la data almacenada dentro del store se puede consultar directamente

```
this.$store.state.notes
```

Sin embargo, al implementarlos, nos simplifican el acceso

Las funciones Getter reciben el estado como su primer argumento.

```
const getters = {
  getNotes(state) {
    return state.notes
  },
  // ES6 Arrow Function
  getTitle: (state) => state.title
}
```

**Store**
Con el estado, las mutaciones, las acciones y los getters configurados, la parte final de la integración de Vuex en nuestra aplicación es crear e integrar la tienda. (Crear la tienda significa que tendremos que conectar todo junto.)

Crear el store:
```
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
})
```

Integrar el store en la aplicación

```
new Vue({
  ...
  store,
})
```

Acceder al store desde cualquier componente: ***$store***

```
computed: {
  getNotes() {
    // lectura de información desde el store
    return this.$store.getters.getNotes
  }
},
methods: {
  addNote(note) {
    // Despachar acciones para mutar el store
    this.$store.dispatch('addNote', note)
  }
}
```

El store Vuex a menudo hace la mayor parte de una aplicación, ya que los componentes se vuelven mucho más simples y se centran principalmente en mostrar la vista. Los métodos declarados en los componentes a menudo se utlizan para despachar acciones, lo que permite que el store Vuex se encargue de todo lo demás.

#### Resumen implementación Vuex en nuestra aplicación

1. La instancia raíz y el componente note-count-component obtienen datos del estado con la ayuda de getters.
2. Cuando se ingresa una entrada, el componente entry-component despachará las acciones addNote y addTimestamp con las cargas útiles apropiadas (la nota y marca de tiempo respectivamente).
3. Estas acciones luego se confirman con las mutaciones relevantes, ADD_NOTE y ADD_TIMESTAMP, pasando además las cargas útiles necesarias.
4. Las mutaciones mutan / modifican el estado, lo que hace que los componentes que tienen los datos de estado modificados (instancia raíz y componente de recuento de notas) se vuelvan a procesar.
