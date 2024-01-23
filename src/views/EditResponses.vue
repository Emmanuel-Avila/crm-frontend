<script setup>
import OffCanvas from "../components/OffCanvas.vue"
import UserCanvas from "../components/UserCanvas.vue"

import { onMounted, ref } from "vue"

import axios from "axios"
import Swal from "sweetalert2"
import router from "../router/index"

const responses = ref([])
const response = ref({})

onMounted(async () => {
  try {
    axios
      .get(`${import.meta.env.VITE_SERVER}/complaints/responses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(function (response) {
        const { data } = response

        responses.value = data
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

function updateResponses() {
  const data = {
    id: response.value._id,
    text: document.querySelector("#responseForm").value,
  }

  console.log("data:", data)
  axios
    .post(`${import.meta.env.VITE_SERVER}/complaints/update-response`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(function (response) {
      const { data } = response
      Swal.fire({
        icon: "success",
        text: "Se editó la queja correctamente",
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload()
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
                  Editar Respuestas
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <!--end breadcrumb-->

        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-body p-4">
                <h5 class="mb-4">Editar Respuestas</h5>
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
                        :value="resp"
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
                      name="responseForm"
                      >{{ response.text }}</textarea
                    >
                  </div>
                  <div class="col-md-12">
                    <div class="d-md-flex d-grid align-items-center gap-3">
                      <button
                        type="button"
                        class="btn button-primary px-4"
                        @click="updateResponses"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </form>
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
