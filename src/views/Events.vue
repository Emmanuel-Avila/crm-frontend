<script setup>
import OffCanvas from '../components/OffCanvas.vue';
import UserCanvas from '../components/UserCanvas.vue';
import Editor from '@tinymce/tinymce-vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup';
import Swal from 'sweetalert2';
import router from "../router/index";


const photoLink = ref('');
const body = ref('');
const title = ref('');

onMounted(() => {
  axios.get(`${import.meta.env.VITE_SERVER}/event`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(function (response) {
      const { data } = response;
      photoLink.value = data.image;
      body.value = data.text;
      title.value = data.title;
    })
    .catch(function (error) {
      if (error.response.status === 401 || error.response.status === 403) {

        Swal.fire({
          icon: 'error',
          text: "Por favor, inicie sesión"
        })
        localStorage.setItem("user", "");
        localStorage.setItem("token", "");
        router.push({ name: "login" });
      } else {
        Swal.fire({
          icon: 'error',
          text: "Hubo un error con la petición, por favor intentelo mas tarde"
        })
      }
      console.log(error.response.message);
    })

})

const widget = window.cloudinary.createUploadWidget(
  { cloud_name: "djtaptkxe", upload_preset: "upload-demo" },
  (error, result) => {
    if (!error && result && result.event === 'success') {
      console.log(result.info);
      photoLink.value = result.info.secure_url
    }
  }
)
function openUploadWidget() {
  widget.open();
}

const schema = yup.object({
  title: yup.string("Deber ser texto").required("Titulo requerido"),
  image: yup.string("No olvide de subir imagen").required("Imagen requerida"),
  body: yup.string("No olvide el cuerpo").required("Cuerpo del blog requerido")
})

function onSubmit(values) {

  console.log(values.body);
  const data = {
    title: values.title,
    image: values.image,
    text: values.body
  }
  axios.post(`${import.meta.env.VITE_SERVER}/event`, data, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(function (response) {
      const { data } = response;
      Swal.fire({
        icon: 'success',
        text: "Se edito la eventos correctamente"
      })
    })
    .catch(function (error) {
      if (error.response.status === 401 || error.response.status === 403) {

        Swal.fire({
          icon: 'error',
          text: "Por favor, inicie sesión"
        })
        localStorage.setItem("user", "");
        localStorage.setItem("token", "");
        router.push({ name: "login" });
      } else {
        Swal.fire({
          icon: 'error',
          text: "Hubo un error con la petición, por favor intentelo mas tarde"
        })
      }
      console.log(error.response.message);
    })

}

</script>

<template >
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
                <li class="breadcrumb-item"><a href="javascript:;"><i class="bx bx-home-alt"></i></a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">Editar eventos</li>
              </ol>
            </nav>
          </div>
        </div>
        <!--end breadcrumb-->

        <div class="row">
          <div class="col-12 col-lg-12">
            <Form @submit='onSubmit' :validation-schema="schema" v-slot="{ values }">
              <div class="card">
                <div class="card-body p-4">
                  <h5 class="mb-4">Formulario para eventos</h5>
                  <div class="row mb-3">
                    <label for="input35" class="col-sm-3 col-form-label">Título</label>
                    <div class="col-sm-9">
                      <Field name='title' type="text" v-model="title" class="form-control" id="input35"
                        placeholder="Ingresa el título">
                      </Field>
                      <ErrorMessage class="red" name="title" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input40" class="col-sm-3 col-form-label">Foto</label>
                    <div class="col-sm-9">
                      <Field type="hidden" name='image' v-model='photoLink' />
                      <img :src="photoLink" alt="" style="width: inherit;">
                      <button class='btn btn-primary px-4' type='button' @click='openUploadWidget()'>Subir Foto</button>
                      <ErrorMessage class="red" name="image" />
                    </div>
                  </div>
                  <div class="row mb-3">
                    <label for="input40" class="col-sm-3 col-form-label">Cuerpo</label>
                    <div class="col-sm-9">
                      <Field name="body" v-model="body">
                        <Editor name='body' v-model="body" api-key="2s0b75pvvp0afr2ld1tbfj1ut3rqh6lan59gojth98anpbyk"
                          :init="{
                            plugins: 'lists link image table code help wordcount media emoticons'
                          }"></Editor>
                      </Field>
                      <ErrorMessage class="red" name="body" />
                    </div>
                  </div>
                  <div class="row">
                    <label class="col-sm-3 col-form-label"></label>
                    <div class="col-sm-9">
                      <div class="d-md-flex d-grid align-items-center gap-3">
                        <button type="submit" class="btn btn-primary px-4">Guardar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>

          </div>


        </div><!--end row-->

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
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="">
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
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="">
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
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="">
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
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="">
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
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="">
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
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="">
            </div>
            <div class="order-info flex-grow-1">
              <h5 class="mb-1 order-title">Home Sofa Set </h5>
              <p class="mb-0 order-price">$546</p>
            </div>
            <div class="d-flex">
              <a class="order-delete"><span class="material-icons-outlined">delete</span></a>
              <a class="order-delete"><span class="material-icons-outlined">visibility</span></a>
            </div>
          </div>

          <div class="order-item d-flex align-items-center gap-3 p-3 border-bottom">
            <div class="order-img">
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="">
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
              <img src="https://placehold.co/75x50" class="img-fluid rounded-3" width="75" alt="">
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
          <button type="button" class="btn btn-dark" data-bs-dismiss="offcanvas">View Products</button>
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
</style>
