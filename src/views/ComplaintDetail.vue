<script setup>
import OffCanvas from "../components/OffCanvas.vue"
import UserCanvas from "../components/UserCanvas.vue"

import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"

import axios from "axios"
import Swal from "sweetalert2"
import router from "../router/index"

const route = useRoute()
const complaint = ref({})
const comments = ref({})
const responses = ref([])

const response = ref("")

onMounted(async () => {
  try {
    axios
      .post(
        `${import.meta.env.VITE_SERVER}/complaints/id`,
        { id: route.params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(function (response) {
        const { data } = response

        comments.value = data.comments
        responses.value = data.responses

        complaint.value = data.complaint
        complaint.value.sentDate = formatDate(complaint.value.sentDate)
        complaint.value.department =
          complaint.value.department === " "
            ? (complaint.value.department = "No especifico")
            : complaint.value.department
        complaint.value.complaintType =
          complaint.value.complaintType === "claim"
            ? (complaint.value.complaintType = "Reclamo")
            : (complaint.value.complaintType = "Queja")
        complaint.value.office =
          complaint.value.office === " "
            ? (complaint.value.office = "No especifico")
            : complaint.value.office
        complaint.value.incidentDate =
          complaint.value.incidentDate !== null
            ? formatDate(complaint.value.incidentDate)
            : ""
      })
      .catch(function (error) {
        console.log(error)
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
  return ` ${recDate.getDate()}/${
    recDate.getMonth() + 1
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

function updateState() {
  Swal.fire({
    title: "Procesando..",
    backdrop: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading()
    },
  })

  const data = {
    id: complaint.value._id,
    action: complaint.value.action,
    state: complaint.value.state,
  }
  axios
    .post(`${import.meta.env.VITE_SERVER}/complaints/updateOne`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(function (response) {
      const { data } = response
      Swal.fire({
        icon: "success",
        text: "Se envió la respuesta correctamente",
        backdrop: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: false,
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload()
        }
      })
      
      console.log(data)
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
}

function sendResponse() {
  Swal.fire({
    title: "Procesando..",
    backdrop: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading()
    },
  })

  const data = new FormData()

  data.append("commentId", complaint.value.comments)
  data.append("text", document.querySelector("#responseForm")._value)
  data.append("email", complaint.value.email)
  data.append("complaintCode", complaint.value.code)
  data.append("clientNames", complaint.value.names)

  const input50 = document.querySelector("#input50").files[0]
  const input51 = document.querySelector("#input51").files[0]

  data.append("documents", input50)
  data.append("documents", input51)

  data.append("responseDate", new Date())

  console.log(data)
  axios
    .post(`${import.meta.env.VITE_SERVER}/complaints/send-response`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(function (response) {
      const { data } = response
      console.log(data)
      Swal.fire({
        icon: "success",
        text: "Se envió la respuesta correctamente",
        backdrop: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: false,
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload()
        }
      })
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
}
</script>

<template>
  <body v-jquery>
    <!--start header-->
    <header class="top-header">
      <nav
        class="navbar navbar-expand align-items-center justify-content-between gap-3"
      >
        <div class="btn-toggle">
          <a href="#offcanvasPrimaryMenu" data-bs-toggle="offcanvas"
            ><i class="material-icons-outlined">menu</i></a
          >
        </div>
      </nav>
    </header>
    <!--end top header-->

    <!--start mini sidebar-->
    <aside
      class="mini-sidebar d-flex align-items-center flex-column justify-content-between"
    >
      <div class="user">
        <a
          href="#offcanvasUserDetails"
          data-bs-toggle="offcanvas"
          class="user-icon"
        >
          <i class="material-icons-outlined">account_circle</i>
        </a>
      </div>
    </aside>
    <!--end mini sidebar-->

    <main class="main-wrapper">
      <div class="main-content">
        <!--breadcrumb-->
        <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div class="breadcrumb-title pe-3">Reclamos</div>
          <div class="ps-3">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-0 p-0">
                <li class="breadcrumb-item">
                  <a href="javascript:;"><i class="bx bx-home-alt"></i></a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  Detalle
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <!--end breadcrumb-->

        <div class="row">
          <div class="col-12 col-xl-6">
            <div class="card">
              <div class="card-body p-4">
                <h5 class="mb-4">Formulario de contenido</h5>
                <form class="row g-3">
                  <div class="col-md-12">
                    <label for="input3" class="form-label">Codigo</label>
                    <input
                      type="text"
                      class="form-control"
                      name="code"
                      v-model="complaint.code"
                      id="input3"
                      disabled
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="input1" class="form-label">Tipo</label>
                    <input
                      type="text"
                      class="form-control"
                      id="input1"
                      name="complaintType"
                      disabled
                      v-model="complaint.complaintType"
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="input2" class="form-label">Sede</label>
                    <input
                      type="text"
                      class="form-control"
                      id="input2"
                      v-model="complaint.office"
                      disabled
                    />
                  </div>
                  <div class="col-md-12">
                    <label for="input4" class="form-label"
                      >Nombre y Apellido</label
                    >
                    <input
                      type="text"
                      :value="complaint.names + ' ' + complaint.surnames"
                      class="form-control"
                      id="input4"
                      disabled
                    />
                  </div>
                  <div class="col-md-4">
                    <label for="child" class="form-label"
                      >¿Es menor de edad?</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="child"
                      disabled
                      v-model="complaint.isChild"
                    />
                  </div>
                  <div class="col-md-8">
                    <label for="input5" class="form-label"
                      >Nombre y Apellido (Apoderado)</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="input5"
                      :value="
                        complaint.guardianNames +
                        ' ' +
                        complaint.guardianSurnames
                      "
                      disabled
                    />
                  </div>
                  <div class="col-md-12">
                    <label for="input6" class="form-label">Email</label>
                    <input
                      type="text"
                      class="form-control"
                      id="input6"
                      v-model="complaint.email"
                      disabled
                    />
                  </div>
                  <div class="col-md-12">
                    <label for="document" class="form-label">Documento</label>
                    <input
                      type="text"
                      class="form-control"
                      id="document"
                      :value="
                        complaint.documentType + ' - ' + complaint.documentValue
                      "
                      disabled
                    />
                  </div>
                  <div class="col-md-12">
                    <label for="phone" class="form-label">Telefono</label>
                    <input
                      type="text"
                      class="form-control"
                      id="phone"
                      v-model="complaint.phone"
                      disabled
                    />
                  </div>

                  <div class="col-md-4">
                    <label for="input8" class="form-label">Departamento</label>
                    <input
                      type="text"
                      class="form-control"
                      id="input8"
                      v-model="complaint.department"
                      disabled
                    />
                  </div>
                  <div class="col-md-4">
                    <label for="input9" class="form-label">Provincia</label>
                    <input
                      type="text"
                      class="form-control"
                      id="input9"
                      :value="
                        complaint.province === ''
                          ? complaint.province
                          : 'No Especifico'
                      "
                      disabled
                    />
                  </div>
                  <div class="col-md-4">
                    <label for="input10" class="form-label">Distrito</label>
                    <input
                      type="text"
                      class="form-control"
                      id="input10"
                      :value="
                        complaint.district === ''
                          ? complaint.district
                          : 'No Especifico'
                      "
                      disabled
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="good" class="form-label">Bien Contratado</label>
                    <input
                      type="text"
                      class="form-control"
                      id="good"
                      v-model="complaint.contractedProduct"
                      disabled
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="category" class="form-label">Categoria</label>
                    <input
                      type="text"
                      class="form-control"
                      id="category"
                      v-model="complaint.productType"
                      disabled
                    />
                  </div>

                  <div class="col-md-6">
                    <label for="divisa" class="form-label">Moneda</label>
                    <input
                      type="text"
                      class="form-control"
                      id="divisa"
                      v-model="complaint.divisa"
                      disabled
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="amount" class="form-label"
                      >Monto Reclamado</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      id="amount"
                      v-model="complaint.amount"
                      disabled
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="sentDate" class="form-label"
                      >Fecha queja enviada</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="sentDate"
                      v-model="complaint.sentDate"
                      disabled
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="sentDate" class="form-label"
                      >Fecha del Incidente</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="sentDate"
                      v-model="complaint.incidentDate"
                      disabled
                    />
                  </div>
                  <div class="col-md-12">
                    <label for="details" class="form-label">Detalles</label>
                    <textarea
                      class="form-control"
                      id="details"
                      rows="3"
                      disabled
                      >{{ complaint.details }}</textarea
                    >
                  </div>
                  <div class="col-md-12">
                    <label for="request" class="form-label">Pedido</label>
                    <textarea
                      class="form-control"
                      id="request"
                      disabled
                      rows="3"
                      >{{ complaint.request }}</textarea
                    >
                  </div>
                  <div class="col-md-12">
                    <label for="notification" class="form-label"
                      >Medio de Notificacion</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="notification"
                      v-model="complaint.notificationType"
                      disabled
                    />
                  </div>
                  <div class="col-md-12">
                    <label for="notification" class="form-label"
                      >Adjuntos</label
                    >
                    <div>
                      <a
                        v-for="(docu, index) in complaint.documents"
                        :key="index"
                        :href="docu"
                        target="_blank"
                        >{{ docu }}</a
                      >
                    </div>
                  </div>
                  <div class="col-md-12">
                    <label for="input7" class="form-label">Estado</label>
                    <select
                      id="input7"
                      class="form-select"
                      v-model="complaint.state"
                      name="state"
                    >
                      <option value="PENDING">Pendiente</option>
                      <option value="REVISION">En revision</option>
                      <option value="OBSERVACION">En observacion</option>
                      <option value="SERVED">Atendido</option>
                      <option value="REJECTED">Rechazado</option>
                      <option value="ANULLED">Anulado</option>
                    </select>
                  </div>
                  <div class="col-md-12">
                    <label for="input11" class="form-label"
                      >Acciones Adoptados por el proveedor</label
                    >
                    <textarea
                      name="action"
                      v-model="complaint.action"
                      class="form-control"
                      id="input11"
                      rows="3"
                    ></textarea>
                  </div>
                  <div class="col-md-12">
                    <div class="d-md-flex d-grid align-items-center gap-3">
                      <button
                        type="button"
                        class="btn button-primary px-4"
                        @click="updateState"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="col-12 col-xl-6">
            <div class="card">
              <div class="card-body p-4">
                <h5 class="mb-4">Formulario de Respuesta</h5>
                <form class="row g-3">
                  <div class="col-md-12">
                    <label for="input19" class="form-label"
                      >Seleccione Respuesta</label
                    >
                    <select id="input19" class="form-select" v-model="response">
                      <option selected value="">Elija...</option>
                      <option
                        v-for="(resp, index) in responses"
                        :key="resp._id"
                        :value="resp.text"
                      >
                        {{ "Respuesta " + (index + 1) }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-12">
                    <label for="input23" class="form-label">Respuesta</label>
                    <textarea
                      class="form-control"
                      id="responseForm"
                      rows="5"
                      :value="response"
                      name="responseForm"
                    ></textarea>
                  </div>
                  <div class="col-md-12">
                    <label for="input50" class="form-label">Archivo 1:</label>
                    <input
                      type="file"
                      class="form-control"
                      id="input50"
                      name="documents"
                    />
                  </div>
                  <div class="col-md-12">
                    <label for="input51" class="form-label">Archivo 2:</label>
                    <input
                      type="file"
                      class="form-control"
                      id="input51"
                      name="documents"
                    />
                  </div>
                  <div class="col-md-12">
                    <div class="d-md-flex d-grid align-items-center gap-3">
                      <button
                        type="button"
                        class="btn button-primary px-4"
                        @click="sendResponse"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div class="card-body p-4">
                <h5 class="mb-4">Historial de conversacion</h5>
                <!-- <div v-if="comments.messages.length === 0">
                  <label>No hay respuestas para mostrar</label>
                </div> -->
                <div
                  class="col-md-12"
                  v-for="(comme, index) in comments.messages"
                  :key="index"
                >
                  <label for="input23" class="form-label">Respuesta</label>
                  <textarea
                    class="form-control"
                    :id="'inputco' + index"
                    rows="5"
                    disabled
                    >{{ comme }}</textarea
                  >
                </div>
                <div class="col-md-12 pt-2">
                  <h5>Documentos Enviados</h5>
                </div>
                <div
                  class="col-md-12"
                  v-for="(docu, index) in comments.documents"
                >
                  <a :href="docu" target="_blank" rel="noopener noreferrer">{{
                    docu
                  }}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end row-->
      </div>
    </main>

    <!--start cart-->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasCart">
      <div class="offcanvas-header border-bottom h-70">
        <h5 class="mb-0" id="offcanvasRightLabel">8 New Orders</h5>
        <a
          href="javascript:;"
          class="primaery-menu-close"
          data-bs-dismiss="offcanvas"
        >
          <i class="material-icons-outlined">close</i>
        </a>
      </div>
      <div class="offcanvas-body p-0">
        <div class="order-list">
          <div
            class="order-item d-flex align-items-center gap-3 p-3 border-bottom"
          >
            <div class="order-img">
              <img
                src="https://placehold.co/75x50"
                class="img-fluid rounded-3"
                width="75"
                alt=""
              />
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">White Men Shoes</h5>
              <p class="mb-0 order-price">$289</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"
                ><span class="material-icons-outlined">delete</span></a
              >
              <a class="order-delete"
                ><span class="material-icons-outlined">visibility</span></a
              >
            </div>
          </div>

          <div
            class="order-item d-flex align-items-center gap-3 p-3 border-bottom"
          >
            <div class="order-img">
              <img
                src="https://placehold.co/75x50"
                class="img-fluid rounded-3"
                width="75"
                alt=""
              />
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Red Airpods</h5>
              <p class="mb-0 order-price">$149</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"
                ><span class="material-icons-outlined">delete</span></a
              >
              <a class="order-delete"
                ><span class="material-icons-outlined">visibility</span></a
              >
            </div>
          </div>

          <div
            class="order-item d-flex align-items-center gap-3 p-3 border-bottom"
          >
            <div class="order-img">
              <img
                src="https://placehold.co/75x50"
                class="img-fluid rounded-3"
                width="75"
                alt=""
              />
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Men Polo Tshirt</h5>
              <p class="mb-0 order-price">$139</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"
                ><span class="material-icons-outlined">delete</span></a
              >
              <a class="order-delete"
                ><span class="material-icons-outlined">visibility</span></a
              >
            </div>
          </div>

          <div
            class="order-item d-flex align-items-center gap-3 p-3 border-bottom"
          >
            <div class="order-img">
              <img
                src="https://placehold.co/75x50"
                class="img-fluid rounded-3"
                width="75"
                alt=""
              />
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Blue Jeans Casual</h5>
              <p class="mb-0 order-price">$485</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"
                ><span class="material-icons-outlined">delete</span></a
              >
              <a class="order-delete"
                ><span class="material-icons-outlined">visibility</span></a
              >
            </div>
          </div>

          <div
            class="order-item d-flex align-items-center gap-3 p-3 border-bottom"
          >
            <div class="order-img">
              <img
                src="https://placehold.co/75x50"
                class="img-fluid rounded-3"
                width="75"
                alt=""
              />
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Fancy Shirts</h5>
              <p class="mb-0 order-price">$758</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"
                ><span class="material-icons-outlined">delete</span></a
              >
              <a class="order-delete"
                ><span class="material-icons-outlined">visibility</span></a
              >
            </div>
          </div>

          <div
            class="order-item d-flex align-items-center gap-3 p-3 border-bottom"
          >
            <div class="order-img">
              <img
                src="https://placehold.co/75x50"
                class="img-fluid rounded-3"
                width="75"
                alt=""
              />
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Home Sofa Set</h5>
              <p class="mb-0 order-price">$546</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"
                ><span class="material-icons-outlined">delete</span></a
              >
              <a class="order-delete"
                ><span class="material-icons-outlined">visibility</span></a
              >
            </div>
          </div>

          <div
            class="order-item d-flex align-items-center gap-3 p-3 border-bottom"
          >
            <div class="order-img">
              <img
                src="https://placehold.co/75x50"
                class="img-fluid rounded-3"
                width="75"
                alt=""
              />
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Black iPhone</h5>
              <p class="mb-0 order-price">$1049</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"
                ><span class="material-icons-outlined">delete</span></a
              >
              <a class="order-delete"
                ><span class="material-icons-outlined">visibility</span></a
              >
            </div>
          </div>

          <div
            class="order-item d-flex align-items-center gap-3 p-3 border-bottom"
          >
            <div class="order-img">
              <img
                src="https://placehold.co/75x50"
                class="img-fluid rounded-3"
                width="75"
                alt=""
              />
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Goldan Watch</h5>
              <p class="mb-0 order-price">$689</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"
                ><span class="material-icons-outlined">delete</span></a
              >
              <a class="order-delete"
                ><span class="material-icons-outlined">visibility</span></a
              >
            </div>
          </div>
        </div>
      </div>
      <div class="offcanvas-footer h-70 p-3 border-top">
        <div class="d-grid">
          <button
            type="button"
            class="btn btn-dark"
            data-bs-dismiss="offcanvas"
          >
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
