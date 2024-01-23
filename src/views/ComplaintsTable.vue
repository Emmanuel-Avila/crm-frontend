<script setup>
import OffCanvas from "../components/OffCanvas.vue"
import UserCanvas from "../components/UserCanvas.vue"
import { ref, onMounted, computed, watch } from "vue"
import axios from "axios"
import Swal from "sweetalert2"
import router from "../router/index"
import "@vuepic/vue-datepicker/dist/main.css"

import Vue3EasyDataTable from "vue3-easy-data-table"
import "vue3-easy-data-table/dist/style.css"

import departaments from "../ubigeo/departments.json"

import VueDatePicker from "@vuepic/vue-datepicker"
import "@vuepic/vue-datepicker/dist/main.css"

import ExcelJS from "exceljs"

const rehabilitadoraURI = import.meta.env.VITE_REHABILITADORA_URI + "/consulta"
const consultarItem = (item) => {
  window.open(rehabilitadoraURI + "/" + item.code)
}

const complaints = ref([])

const searchText = ref("")
const searchField = [
  "code",
  "names",
  "surnames",
  "email",
  "state",
  "complaintType",
]

const stateCriteria = ref("all")
const typeCriteria = ref("all")
const officeCriteria = ref("all")
const departmentCriteria = ref("all")

const filterOptions = computed(() => {
  const filterOptionsArray = []
  if (stateCriteria.value !== "all") {
    filterOptionsArray.push({
      field: "state",
      comparison: "=",
      criteria: stateCriteria.value,
    })
  }

  if (typeCriteria.value !== "all") {
    filterOptionsArray.push({
      field: "complaintType",
      comparison: "=",
      criteria: typeCriteria.value,
    })
  }

  if (officeCriteria.value !== "all") {
    filterOptionsArray.push({
      field: "office",
      comparison: "=",
      criteria: officeCriteria.value,
    })
  }

  if (departmentCriteria.value !== "all") {
    filterOptionsArray.push({
      field: "department",
      comparison: "=",
      criteria: departmentCriteria.value,
    })
  }
  return filterOptionsArray
})

const showStateFilter = ref(false)
const showTypeFilter = ref(false)
const showOfficeFilter = ref(false)
const showDepartmentFilter = ref(false)

const headers = [
  { text: "Codigo", value: "code" },
  { text: "Tipo", value: "complaintType" },
  { text: "Sede", value: "office" },
  { text: "Nombres", value: "names" },
  { text: "Apellidos", value: "surnames" },
  { text: "Documento de Identidad", value: "documentValue" },
  { text: "Email", value: "email", sortable: true },
  { text: "Es Menor de Edad", value: "isChild" },
  { text: "Estado", value: "state", sortable: true },
  { text: "Departamento", value: "department", sortable: true },
  { text: "Fecha de Registro", value: "sentDate" },
  { text: "Accion", value: "accion" },
]

const dateFilter = ref({
  since: "",
  until: "",
})

onMounted(async () => {
  try {
    axios
      .get(`${import.meta.env.VITE_SERVER}/complaints`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        const { data } = response
        complaints.value = data
        complaints.value.forEach(
          (comp) => (comp.sentDate = formatDate(comp.sentDate))
        )
        complaints.value.forEach((comp) =>
          comp.department === " "
            ? (comp.department = "No especifico")
            : comp.department
        )
        complaints.value.forEach((comp) =>
          comp.complaintType === "claim"
            ? (comp.complaintType = "Reclamo")
            : (comp.complaintType = "Queja")
        )
        complaints.value.forEach(
          (comp) => (comp.state = formatState(comp.state))
        )
        complaints.value.forEach((comp) =>
          comp.office === " " ? (comp.office = "No especifico") : comp.office
        )
      })
      .catch(function (error) {
        if (error.response.status === 401 || error.response.status === 403) {
          Swal.fire({
            icon: "error",
            text: "Por favor, inicie sesión",
          })
          localStorage.setItem("user", "")
          localStorage.setItem("token", "")
          router.push({ name: "login" })
        } else {
          Swal.fire({
            icon: "error",
            text: "Hubo un error con la petición, por favor intentelo mas tarde",
          })
        }
        console.log(error.response.message)
      })
  } catch (error) {
    console.log(error)
  }
})

function formatDate(date) {
  const recDate = new Date(date)
  return ` ${recDate.getDate()}/${recDate.getMonth() + 1
    }/${recDate.getFullYear()}`
}

function formatState(state) {
  switch (state) {
    case "PENDING":
      return "Pendiente"
      break
    case "REVISION":
      return "En revision"
      break
    case "OBSERVACION":
      return "En observacion"
      break
    case "SERVED":
      return "Atendido"
      break
    case "REJECTED":
      return "Rechazado"
      break
    case "ANULLED":
      return "Anulado"
      break
    default:
      return "Problema con la base de datos"
  }
}

const minSinceDate = computed(() => {
  if (dateFilter.value.since && dateFilter.value.since != "") {
    return new Date(dateFilter.value.since)
  } else {
    return null
  }
})

const maxUntilDate = computed(() => {
  if (dateFilter.value.until && dateFilter.value.until != "") {
    return new Date(dateFilter.value.until)
  } else {
    return null
  }
})

watch(
  dateFilter,
  (newValue, oldValue) => {
    try {
      const body = {
        greater: newValue.since ? newValue.since : "",
        lesser: newValue.until ? newValue.until : "",
      }

      console.log(body)
      axios
        .post(`${import.meta.env.VITE_SERVER}/complaints/filter`, body, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then(function (response) {
          const { data } = response
          complaints.value = data
          if (complaints.value.length > 0) {
            complaints.value.forEach(
              (comp) => (comp.sentDate = formatDate(comp.sentDate))
            )
            complaints.value.forEach((comp) =>
              comp.department === " "
                ? (comp.department = "No especifico")
                : comp.department
            )
            complaints.value.forEach((comp) =>
              comp.complaintType === "claim"
                ? (comp.complaintType = "Reclamo")
                : (comp.complaintType = "Queja")
            )
            complaints.value.forEach(
              (comp) => (comp.state = formatState(comp.state))
            )
            complaints.value.forEach((comp) =>
              comp.office === " "
                ? (comp.office = "No especifico")
                : comp.office
            )
          }
        })
        .catch(function (error) {
          if (error.response.status === 401 || error.response.status === 403) {
            Swal.fire({
              icon: "error",
              text: "Por favor, inicie sesión",
            })
            localStorage.setItem("user", "")
            localStorage.setItem("token", "")
            router.push({ name: "login" })
          } else {
            Swal.fire({
              icon: "error",
              text: "Hubo un error con la petición, por favor intentelo mas tarde",
            })
          }
          console.log(error.response.message)
        })
    } catch (error) {
      console.log(error)
    }
  },
  { deep: true }
)

// ******************************

async function exportToExcel() {
  // Aquí se simula la información obtenida del backend
  const dataFromBackend = [
    // Datos recibidos del backend
    // ...
  ]

  // Crear un nuevo libro de Excel
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Datos")

  // Añadir encabezados
  worksheet.addRow(null)
  worksheet.addRow(null)

  const headerStruct = [
    {
      label: "Nro. Reclamo",
      widht: 20,
      key: "code",
    },
    {
      label: "Cliente",
      widht: 20,
      key: "client",
    },
    {
      label: "Sede",
      widht: 20,
      key: "office",
    },
    {
      label: "Tipo",
      widht: 40,
      key: "complaintType",
    },
    {
      label: "Nombre y Apellido",
      widht: 40,
      key: "name",
    },
    {
      label: "Es menor de edad?",
      widht: 20,
      key: "isChild",
    },
    {
      label: "Tipo de Documento",
      widht: 20,
      key: "documentType",
    },
    {
      label: "Nro. Documento",
      widht: 20,
      key: "documentValue",
    },
    {
      label: "Email",
      widht: 20,
      key: "email",
    },
    {
      label: "Dirección",
      widht: 40,
      key: "address",
    },
    {
      label: "Teléfono",
      widht: 20,
      key: "phone",
    },
    {
      label: "Estado del Reclamo",
      widht: 20,
      key: "state",
    },
    {
      label: "Tipo de Notificación",
      widht: 20,
      key: "notificationType",
    },
    {
      label: "Detalle",
      widht: 20,
      key: "details",
    },
    {
      label: "Distrito",
      widht: 20,
      key: "district",
    },
    {
      label: "Provincia",
      widht: 20,
      key: "province",
    },
    {
      label: "Departamento",
      widht: 20,
      key: "department",
    },
    {
      label: "Comentarios",
      widht: 20,
      key: "comments",
    },
    {
      label: "Nombres de guardianes",
      widht: 40,
      key: "guardian",
    },
    {
      label: "Tipo de Producto",
      widht: 20,
      key: "productType",
    },
    {
      label: "Producto contratado",
      widht: 20,
      key: "contractedProduct",
    },
    {
      label: "Divisa",
      widht: 20,
      key: "divisa",
    },
    {
      label: "Monto",
      widht: 20,
      key: "amount",
    },
    {
      label: "Fecha de Incidente",
      widht: 40,
      key: "incidentDate",
    },
    {
      label: "Hora de Incidente",
      widht: 20,
      key: "incidentTime",
    },
    {
      label: "Fecha de Respuesta",
      widht: 40,
      key: "responseDate",
    },
    {
      label: "Requerimiento",
      widht: 20,
      key: "request",
    },
    {
      label: "Fecha de Envío",
      widht: 20,
      key: "sentDate",
    },
    {
      label: "Acción",
      widht: 20,
      key: "action",
    },
  ]

  worksheet.addRow(
    headerStruct.map((header) => {
      return header.label
    })
  )

  const letterList = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "AA",
    "AB",
    "AC",
    "AD",
  ]

  headerStruct.forEach((header, index) => {
    const columnLabel = letterList[index]

    const column = worksheet.getColumn(columnLabel)
    column.width = header.widht

    worksheet.getCell(`${columnLabel}1`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "350028" },
    }
    worksheet.getCell(`${columnLabel}2`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "350028" },
    }
    worksheet.getCell(`${columnLabel}3`).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ffff00" },
    }
  })

  // Añadir datos
  complaints.value.forEach((data) => {
    const row = {}
    headerStruct.forEach((header) => {
      if (header.key == "client") {
        row[`${header.label}`] = "La Rehabilitadora"
      } else if (header.key == "name") {
        row[`${header.label}`] = `${data.names} ${data.surnames}`
      } else if (header.key == "guardian") {
        row[
          `${header.label}`
        ] = `${data.guardianNames} ${data.guardianSurnames}`
      } else {
        row[`${header.label}`] = data[`${header.key}`]
      }
    })

    worksheet.addRow(Object.values(row))
  })

  // Generar un blob con el libro de Excel
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  // Crear una URL de descarga y hacer clic en ella
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", "datos.xlsx")
  document.body.appendChild(link)
  link.click()

  // Liberar recursos
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

function clearFilter() {
  stateCriteria.value = "all"
  typeCriteria.value = "all"
  officeCriteria.value = "all"
  departmentCriteria.value = "all"
  searchText.value = ""
  dateFilter.value.since = ""
  dateFilter.value.until = ""
}
</script>

<template>
  <body v-jquery>
    <!--start header-->
    <header class="top-header">
      <nav class="navbar navbar-expand align-items-center justify-content-between gap-3">
        <div class="btn-toggle">
          <a href="#offcanvasPrimaryMenu" data-bs-toggle="offcanvas"><i class="material-icons-outlined">menu</i></a>
        </div>
      </nav>
    </header>
    <!--end top header-->

    <!--start mini sidebar-->
    <aside class="mini-sidebar d-flex align-items-center flex-column justify-content-between">
      <div class="user">
        <a href="#offcanvasUserDetails" data-bs-toggle="offcanvas" class="user-icon">
          <i class="material-icons-outlined">account_circle</i>
        </a>
      </div>
    </aside>
    <!--end mini sidebar-->

    <!--start main wrapper-->
    <main class="main-wrapper">
      <div class="main-content">
        <!--breadcrumb-->
        <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div class="breadcrumb-title pe-3">Dashboard</div>
          <div class="ps-3">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0 p-0">
                <li class="breadcrumb-item">
                  <a href="javascript:;"><i class="bx bx-home-alt"></i></a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  Tabla de Reclamos
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <!--end breadcrumb-->

        <div class="card">
          <div class="card-body">
            <div class="row mb-2 mt-2">
              <div class="col-12 col-md-5 col-lg-3 my-2">
                <div class="row mx-0">
                  <div class="col-sm-3 col-md-4 px-md-0">
                    <label for="typeSelect">Tipo</label>
                  </div>
                  <div class="col-sm-9 col-md-8">
                    <select name="type" id="typeSelect" class="form-select" v-model="typeCriteria">
                      <option value="all">Todos</option>
                      <option value="Reclamo">Reclamo</option>
                      <option value="Queja">Queja</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-5 col-lg-3 my-2">
                <div class="row mx-0">
                  <div class="col-sm-3 col-md-4 px-md-0">
                    <label for="sedeSelect">Sede</label>
                  </div>
                  <div class="col-sm-9 col-md-8">
                    <select name="type" id="sedeSelect" class="form-select" v-model="officeCriteria">
                      <option value="all">Todos</option>
                      <option value="Lima">Lima</option>
                      <option value="Ica">Ica</option>
                      <option value="Piura">Piura</option>
                      <option value="Chiclayo">Chiclayo</option>
                      <option value="Pucallpa">Pucallpa</option>
                      <option value="Huanuco">Huanuco</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-5 col-lg-3 my-2">
                <div class="row mx-0">
                  <div class="col-sm-3 col-md-4 px-md-0">
                    <label class="m-auto">F. Registro (desde):</label>
                  </div>
                  <div class="col-sm-9 col-md-8">
                    <VueDatePicker v-model="dateFilter.since" locale="es" :enable-time-picker="false"
                      :max-date="maxUntilDate"></VueDatePicker>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-5 col-lg-3 my-2">
                <div class="row mx-0">
                  <div class="col-sm-3 col-md-4 px-md-0">
                    <label class="m-auto">F. Registro (hasta):</label>
                  </div>
                  <div class="col-sm-9 col-md-8">
                    <VueDatePicker v-model="dateFilter.until" locale="es" :enable-time-picker="false"
                      :min-date="minSinceDate"></VueDatePicker>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mb-2">
              <div class="col-12 col-md-5 col-lg-3 mb-2 mt-md-2">
                <div class="row mx-0">
                  <div class="col-sm-3 col-md-4 px-md-0">
                    <label for="statusSelect">Estado</label>
                  </div>
                  <div class="col-sm-9 col-md-8">
                    <select name="state" id="statusSelect" class="form-select" v-model="stateCriteria">
                      <option value="all">Todos</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="En revision">En revision</option>
                      <option value="En observacion">En observacion</option>
                      <option value="Atendido">Atendido</option>
                      <option value="Rechazado">Rechazado</option>
                      <option value="Anulado">Anulado</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="col-12 col-md-5 col-lg-3 my-2">
                <div class="row mx-0">
                  <div class="col-sm-3 col-md-4 px-md-0">
                    <label for="departmentSelect">Departamento</label>
                  </div>
                  <div class="col-sm-9 col-md-8">
                    <select name="type" id="departmentSelect" class="form-select" v-model="departmentCriteria">
                      <option value="all">Todos</option>
                      <option :value="depar.name" v-for="(depar, index) in departaments" :key="depar.id">
                        {{ depar.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-5 col-lg-3 my-2">
                <div class="row mx-0">
                  <div class="col-sm-3 col-md-4 px-md-0">
                    <label class="m-auto">Buscar:</label>
                  </div>
                  <div class="col-sm-9 col-md-8">
                    <input type="search" v-model="searchText" class="form-control form-control-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div class="row pb-2 mb-3 d-flex justify-content-end px-2">
              <div class="col-12 col-md-4 col-lg-3 col-xl-2 mb-2">
                <button type="button" @click.stop="clearFilter" class="btn button-secondary w-100">
                  Limpiar Filtros
                </button>
              </div>

              <div class="col-12 col-md-4 col-lg-3 col-xl-2">
                <button type="button" @click.stop="exportToExcel" class="btn button-primary btn-align w-100">
                  <i class="material-icons-outlined">cloud_download</i>
                  Descargar
                </button>
              </div>
            </div>

            <Vue3EasyDataTable buttons-pagination :headers="headers" :items="complaints" theme-color="#0d6efd"
              :search-field="searchField" :search-value="searchText" :filter-options="filterOptions"
              @click-row="consultarItem" alternating bordercell>
              <template #item-accion="item">
                <div class="my-2">
                  <router-link class="btn button-primary"
                    :to="{ name: 'complaint-detail', params: { id: item._id } }">Actualizar</router-link>
                </div>
              </template>
              <template #empty-message>
                <p>No hay informacion para mostrar</p>
              </template>
            </Vue3EasyDataTable>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-lg-12"></div>
        </div>
        <!--end row-->
      </div>
    </main>
    <!--end main wrapper-->

    <!--start cart-->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasCart">
      <div class="offcanvas-header border-bottom h-70">
        <h5 class="mb-0" id="offcanvasRightLabel">8 New Orders</h5>
        <a href="javascript:;" class="primaery-menu-close" data-bs-dismiss="offcanvas">
          <i class="material-icons-outlined">close</i>
        </a>
      </div>
      <div class="offcanvas-body p-0">
        <div class="order-list">
          <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
            <div class="order-img">
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="" />
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">White Men Shoes</h5>
              <p class="mb-0 order-price">$289</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
              <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
            </div>
          </div>

          <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
            <div class="order-img">
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="" />
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Red Airpods</h5>
              <p class="mb-0 order-price">$149</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
              <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
            </div>
          </div>

          <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
            <div class="order-img">
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="" />
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Men Polo Tshirt</h5>
              <p class="mb-0 order-price">$139</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
              <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
            </div>
          </div>

          <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
            <div class="order-img">
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="" />
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Blue Jeans Casual</h5>
              <p class="mb-0 order-price">$485</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
              <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
            </div>
          </div>

          <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
            <div class="order-img">
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="" />
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Fancy Shirts</h5>
              <p class="mb-0 order-price">$758</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
              <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
            </div>
          </div>

          <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
            <div class="order-img">
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="" />
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Home Sofa Set</h5>
              <p class="mb-0 order-price">$546</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
              <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
            </div>
          </div>

          <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
            <div class="order-img">
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="" />
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Black iPhone</h5>
              <p class="mb-0 order-price">$1049</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
              <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
            </div>
          </div>

          <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
            <div class="order-img">
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="" />
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Goldan Watch</h5>
              <p class="mb-0 order-price">$689</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
              <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
            </div>
          </div>
        </div>
      </div>
      <div class="offcanvas-footer h-70 p-3 border-top">
        <div class="d-grid">
          <button type="button" class="btn btn-dark" data-bs-dismiss="offcanvas">
            View Products
          </button>
        </div>
      </div>
    </div>
    <!--end cart-->

    <!--start primary menu offcanvas-->
    <OffCanvas></OffCanvas>
    <!--end primary menu offcanvas-->

    <!--start user details offcanvas-->
    <UserCanvas></UserCanvas>
    <!--end user details offcanvas-->
  </body>
</template>

<style>
.red {
  color: rgb(128, 2, 27);
}

.customize-header {
  display: flex;
  justify-items: center;
  align-items: center;
}

.header-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
}

.filter-menu {
  padding: 15px 30px;
  z-index: 1;
  position: absolute;
  top: 30px;
  width: 200px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
}

.selector {
  width: 100%;
}

.filter-column {
  display: flex;
  align-items: center;
  justify-items: center;
  position: relative;
}

.m-auto {
  margin: auto;
}

.btn-align {
  align-items: center;
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
