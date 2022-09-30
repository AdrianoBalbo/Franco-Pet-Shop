let botonCard = document.getElementById("botonCard")


const { createApp } = Vue;

createApp({
  data() {
    return {
      objetosTienda: [],
      carrito: [],
      nombreDeProducto: [],
      juguetes: [],
      medicamentos: [],
      arrayAuxiliar: [],
      subtotal: [],
      inputTexto:'',
      radioSeleccionado: [],
      objetosTiendaFiltrado: [],
      total: '',
      moneyFormat: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
      cardModal: []
    };
  },
  created() {
    fetch("https://apipetshop.herokuapp.com/api/articulos")
      .then((Response) => Response.json())
      .then((json) => {
        let productosInStorage = JSON.parse(localStorage.getItem('seleccionados'))
        if (productosInStorage) {
          this.carrito = productosInStorage
        }
        if (document.title == 'Farmacia') {
          this.objetosTienda = json.response.filter(e => e.tipo == 'Medicamento')
          
        } else if (document.title == 'Juguetes') {
          this.objetosTienda = json.response.filter(e => e.tipo == 'Juguete')
          // this.objetosTiendaFiltrado = json.response.filter(e => e.tipo == 'Juguete')
        }
        this.arrayAuxiliar = this.objetosTienda

      });
  },
  mounted() { },

  methods: {
    agregarAlCarrito(producto) {
      this.nombreDeProducto = this.carrito.map((producto) => producto.nombre);
      if (!this.nombreDeProducto.includes(producto.nombre)) {
        producto.cantidad = 1;
        this.carrito.push(producto);
        localStorage.setItem("seleccionados", JSON.stringify(this.carrito));
      } else if (this.nombreDeProducto.includes(producto.nombre)) {
        if (producto.cantidad < producto.stock){
          let carritoActualizado = this.carrito.filter(p => p.nombre != producto.nombre)
          producto.cantidad++
          carritoActualizado.push(producto)
          localStorage.setItem("seleccionados", JSON.stringify(carritoActualizado));
          this.carrito = carritoActualizado
        }
      }
    },

    filtroInputTexto() {
      this.objetosTienda = this.arrayAuxiliar.filter(objeto => objeto.nombre.toLowerCase().includes(this.inputTexto.toLowerCase()) || objeto.descripcion.toLowerCase().includes(this.inputTexto.toLowerCase()))
    },

    eliminarProducto(producto) {
      this.nombreDeProducto = this.carrito.map((producto) => producto.nombre)
      if (this.nombreDeProducto.includes(producto.nombre)) {
        producto.cantidad --
        if(producto.cantidad <= 0){
          let carritoActualizado = this.carrito.filter(p => p.nombre != producto.nombre)
          localStorage.setItem("seleccionados", JSON.stringify(carritoActualizado));
          this.carrito = carritoActualizado
          
          console.log(carritoActualizado)
        }else{
          let carritoActualizado = this.carrito.filter(p => p.nombre != producto.nombre)
          carritoActualizado.push(producto)
          localStorage.setItem("seleccionados", JSON.stringify(carritoActualizado));
          this.carrito = carritoActualizado
        }
      }
    },
    ordenAZ(){
      this.objetosTienda.sort((producto1, producto2) => {
        if (producto1.nombre > producto2.nombre){
          return 1
        }
        if (producto1.nombre < producto2.nombre){
          return -1
        }
        return 0
      })
    },
    ordenZA(){
      this.objetosTienda.sort((producto1, producto2) => {
        if (producto1.nombre < producto2.nombre){
          return 1
        }
        if (producto1.nombre > producto2.nombre){
          return -1
        }
        return 0
      })
    },
    ordenMayorPrecio(){
      this.objetosTienda.sort((producto1, producto2) => {
        if (producto1.precio < producto2.precio){
          return 1
        }
        if (producto1.precio > producto2.precio){
          return -1
        }
        return 0
      })
    },
    ordenMenorPrecio(){
      this.objetosTienda.sort((producto1, producto2) => {
        if (producto1.precio > producto2.precio){
          return 1
        }
        if (producto1.precio < producto2.precio){
          return -1
        }
        return 0
      })
    },
  },

  computed: {
    
      vaciarCarrito(){
        this.nombreDeProducto = []
        localStorage.removeItem("seleccionados")
      },

    obtenerTotal() {
      this.subtotal = this.carrito.map(objeto => objeto.precio * objeto.cantidad)
        .reduce((prev, curr) => prev + curr, 0)
    },
    
  },
}).mount("#app");


