<script setup>
import OffCanvas from '../components/OffCanvas.vue';
import UserCanvas from '../components/UserCanvas.vue';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup';
import Swal from 'sweetalert2';
import router from "../router/index"

const ClOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const photoLink = ref('');
const body = ref('');
const photoLinks = ref([{ links: '', redirections: '' }]);
const changedIndex = ref(-1);

const addPhotoLink = () => {
  photoLinks.value.push({ links: '', redirections: '' });
  console.log("agregaste un nuevo elemento", photoLinks.value)
}

const removePhotoLink = (index) => {
  photoLinks.value.splice(index, 1)
}

const onPhotoLinkChange = (newLink, oldLink) => {

  const index = changedIndex.value;
  if (index !== -1) {
    photoLinks.value[index].links = newLink; // Asignar el nuevo valor en 'photoLinks'
    console.log(photoLinks.value[index].links);
  }
};

// Observador para detectar cambios en 'photoLink'
watch(photoLink, onPhotoLinkChange);

onMounted(async () => {
  try {
    axios.get(`${import.meta.env.VITE_SERVER}/images`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(function (response) {
        const { data } = response;

        if (data && data.links) {
          photoLinks.value = data.links.map((link, index) => ({
            links: link,
            redirections: data.redirections[index] || '', // Si no hay valor en 'redirections', asignar cadena vacía
          }));
        }

        console.log("trayendo la informacion del back", photoLinks.value)
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
  } catch (error) {

  }
});


const widget = window.cloudinary.createUploadWidget(
  { cloud_name: ClOUDINARY_CLOUD_NAME, upload_preset: UPLOAD_PRESET },
  (error, result) => {
    if (!error && result && result.event === 'success') {
      console.log(result.info);
      photoLink.value = result.info.secure_url
    }
  }
)
function openUploadWidget(index) {
  changedIndex.value = index
  widget.open();
  console.log("subiste algo", JSON.stringify(photoLink))
}


function onSubmit() {

  const postData = {
    links: photoLinks.value.map(item => item.links),
    redirections: photoLinks.value.map(item => item.redirections)
  };


  axios.post(`${import.meta.env.VITE_SERVER}/images`, postData, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(function (response) {
      const { data } = response;
      Swal.fire({
        icon: 'success',
        text: "Se editaron las imagenes correctamente"
      })
      console.log(data);
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
                <li class="breadcrumb-item active" aria-current="page">Editar Imagénes de Home</li>
              </ol>
            </nav>
          </div>
        </div>
        <!--end breadcrumb-->

        <div class="row">
          <div class="col-12 col-lg-12">
            <Form @submit='onSubmit'>
              <div class="card">
                <div class="card-body p-4">
                  <div v-for="(obj, index) in photoLinks" :key="index">
                    <h5 class="mb-4">Imagenes para la landing</h5>
                    <div class="row mb-3">
                      <label for="input35" class="col-sm-3 col-form-label">Imágenes</label>
                      <div class="col-sm-9">
                        <img :src="obj.links" alt="" style="width: inherit;">
                      </div>
                      <label for="input36" class="col-sm-3 col-form-label">Link</label>
                      <div class="col-sm-9">
                        <input type="text" class='form-control' v-model='obj.redirections'>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="input40" class="col-sm-3 col-form-label">Foto</label>
                      <div class="col-sm-9">
                        <input type="hidden" name="links" v-model='photoLinks[index]' />
                        <button class='btn btn-primary px-4' type='button' @click='openUploadWidget(index)'>Subir
                          Foto</button>
                      </div>
                    </div>
                    <div class="row">
                      <label class="col-sm-3 col-form-label"></label>
                      <div class="col-sm-9">
                        <div class="d-md-flex d-grid align-items-center gap-3">
                          <button type="button" class="btn btn-primary px-4" @click="addPhotoLink()">Añadir</button>
                          <button type="button" class="btn btn-light px-4"
                            @click="removePhotoLink(index)">Remover</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row pt-3">
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
