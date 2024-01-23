<script setup>
import OffCanvas from "../components/OffCanvas.vue"
import UserCanvas from "../components/UserCanvas.vue"

import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"

import { getUserData } from "../helper/auth"
const userData = getUserData()

import axios from "axios"
import Swal from "sweetalert2"
import router from "../router/index"

const route = useRoute()

const user = ref({})

function formatDate(date) {
  const recDate = new Date(date)
  return ` ${recDate.getDate()}/${
    recDate.getMonth() + 1
  }/${recDate.getFullYear()}`
}

function updateState() {
  const data = {
    id: userData._id,
    name: document.querySelector("#input4").value,
    surname: document.querySelector("#surname").value,
    password: document.querySelector("#password").value,
    email: document.querySelector("#email").value,
  }

  console.log(data)
  axios
    .post(`${import.meta.env.VITE_SERVER}/users/update`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(function (response) {
      const { data } = response
      Swal.fire({
        icon: "success",
        text: "Se editó la informacion del usuario correctamente",
      })
      localStorage.setItem("user", "")
      localStorage.setItem("token", "")
      router.push({ name: "login" })
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
          <div class="col-12">
            <div class="card">
              <div class="card-body p-4">
                <h5 class="mb-4">Usuario</h5>
                <form class="row g-3">
                  <div class="col-md-6">
                    <label for="input4" class="form-label">Nombre</label>
                    <input
                      type="text"
                      :value="userData.name"
                      class="form-control"
                      name="name"
                      id="input4"
                    />
                  </div>
                  <div class="col-md-6">
                    <label for="input4" class="form-label">Apellido</label>
                    <input
                      type="text"
                      :value="userData.surname"
                      class="form-control"
                      name="surname"
                      id="surname"
                    />
                  </div>
                  <div class="col-md-12">
                    <label for="child" class="form-label"
                      >Nueva Contraseña</label
                    >
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      name="newPassword"
                    />
                  </div>
                  <div class="col-md-12">
                    <label for="input5" class="form-label">Email</label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      :value="userData.email"
                      name="email"
                    />
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
        </div>
        <!--end row-->
      </div>
    </main>

    <!--start primary menu offcanvas-->
    <OffCanvas></OffCanvas>
    <!--end primary menu offcanvas-->

    <!--start user details offcanvas-->
    <UserCanvas></UserCanvas>
    <!--end user details offcanvas-->
  </body>
</template>
