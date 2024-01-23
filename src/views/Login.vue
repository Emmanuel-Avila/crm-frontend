<script setup>
import axios from "axios"
import { Form, Field, ErrorMessage } from "vee-validate"
import * as yup from "yup"
import Swal from "sweetalert2"
import router from "../router/index"

const schema = yup.object({
  email: yup
    .string("Deber ser texto")
    .email("Debe ser un email válido")
    .required("Email requerido"),
  password: yup.string("Deber ser texto").required("Contraseña requerida"),
})

function onSubmit(values, { resetForm }) {
  axios
    .post(`${import.meta.env.VITE_SERVER}/users`, values)
    .then(function (response) {
      const { data } = response
      localStorage.setItem("token", data.jwt)
      localStorage.setItem("user", JSON.stringify(data.fUser))
      if (data.fUser.type === "CRM") {
        router.push({ name: "blog" })
      } else {
        router.push({ name: "complaints" })
      }
      Swal.fire({
        icon: "success",
        text: "Se inicio sesion exitosamente",
      })
      resetForm()
    })
    .catch(function (error) {
      Swal.fire({
        icon: "error",
        text: "Credenciales Invalidas",
      })
      resetForm()
      console.log(error)
    })
}
</script>

<template>
  <!--authentication-->

  <div class="container-fluid my-5">
    <div class="row">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5 col-xxl-4 mx-auto">
        <div class="card rounded-4">
          <div class="card-body p-5">
            <h4 class="fw-bold">Inicia Sesión</h4>
            <p class="mb-0">Ingresa tus credenciales para ingresar</p>

            <div class="form-body my-4">
              <Form
                @submit="onSubmit"
                :validation-schema="schema"
                v-slot="{ values }"
              >
                <div class="col-12">
                  <label for="inputEmailAddress" class="form-label"
                    >Email</label
                  >
                  <Field
                    type="email"
                    class="form-control"
                    id="inputEmailAddress"
                    name="email"
                    placeholder="jhon@example.com"
                  ></Field>
                </div>
                <ErrorMessage class="red" name="email" />
                <div class="col-12">
                  <label for="inputChoosePassword" class="form-label"
                    >Contraseña</label
                  >
                  <div class="input-group" id="show_hide_password">
                    <Field
                      type="password"
                      class="form-control border-end-0"
                      id="inputChoosePassword"
                      name="password"
                      placeholder="Ingresa tu contraseña"
                    ></Field>
                  </div>
                </div>
                <ErrorMessage class="red" name="password" />
                <div class="col-12 pt-20">
                  <div class="d-grid">
                    <button type="submit" class="btn button-primary">
                      Login
                    </button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--end row-->
  </div>

  <!--authentication-->
</template>

<script>
$(document).ready(function () {
  $("#show_hide_password a").on("click", function (event) {
    event.preventDefault()
    if ($("#show_hide_password input").attr("type") == "text") {
      $("#show_hide_password input").attr("type", "password")
      $("#show_hide_password i").addClass("bi-eye-slash-fill")
      $("#show_hide_password i").removeClass("bi-eye-fill")
    } else if ($("#show_hide_password input").attr("type") == "password") {
      $("#show_hide_password input").attr("type", "text")
      $("#show_hide_password i").removeClass("bi-eye-slash-fill")
      $("#show_hide_password i").addClass("bi-eye-fill")
    }
  })
})
</script>

<style>
.pt-20 {
  padding-top: 20px;
}

.red {
  color: rgb(128, 2, 27);
}
</style>
