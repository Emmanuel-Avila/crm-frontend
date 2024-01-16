<script setup>
import OffCanvas from '../components/OffCanvas.vue';
import UserCanvas from '../components/UserCanvas.vue';
import { onMounted, ref } from 'vue';
import { Form } from 'vee-validate'
import axios from 'axios';
import Swal from 'sweetalert2';
import router from "../router/index"

const ClOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const addIndex = ref([]);
const cancelBtnisDisabled = ref(false);
const addBtnisDisabled = ref(false);

const initialSection = { inputValue: '' };
const sections = ref([{ inputValue: '' }]);


const photoLink = ref('');
const widget = window.cloudinary.createUploadWidget(
  { cloud_name: ClOUDINARY_CLOUD_NAME, upload_preset: UPLOAD_PRESET },
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

const addSection = () => {
  cancelBtnisDisabled.value = true
  sections.value.push({ ...initialSection });

};

const removeSection = (index) => {
  addBtnisDisabled.value = true
  sections.value.splice(index, 1);
};

const handleChange = (index) => {
  console.log(index);
  addIndex.value.push(index);
}

onMounted(() => {
  axios.get(`${import.meta.env.VITE_SERVER}/election`,
    {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    }
  )
    .then(response => {
      if (response.data.documents.length > 0) {
        sections.value = response.data.documents.map(document => { return { inputValue: document.name } });
        photoLink.value = response.data.image
      }

      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
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
      console.log(error);
    })
})


function onSubmit() {
  const formData = new FormData();

  const fileInputs = document.querySelectorAll("input[name='files']")
  const textInputs = document.querySelectorAll("input[name='documentNames']")

  const documentNames = [];
  const files = [];

  fileInputs.forEach((input) => {
    const fileList = input.files;
    for (let i = 0; i < fileList.length; i++) {
      formData.append("files", fileList[i])
      files.push(fileList[i]);
    }
  });
  textInputs.forEach((input) => {
    const value = input.value;
    documentNames.push(value);
    formData.append("documentNames", input.value);
  });

  formData.append("image", photoLink.value)

  if (addIndex.value.length !== 0) {

    formData.append("addIndexs", JSON.stringify(addIndex.value))
  } else {
    formData.append("addIndexs", JSON.stringify([]));
  }

  for (const pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }



  axios.post(`${import.meta.env.VITE_SERVER}/election`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(function (response) {
      const { data } = response;
      Swal.fire({
        icon: 'success',
        text: "Se editó la seccion de Elecciones correctamente"
      })
      // location.reload()
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
      console.log(error);
    })
}
</script>

<template>
  <div v-jquery>
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
                <li class="breadcrumb-item active" aria-current="page">Editar Elecciones</li>
              </ol>
            </nav>
          </div>
        </div>

        <Form @submit='onSubmit'>

          <div class="row">
            <div class="col-12 col-lg-12">
              <div class="card">
                <div class="card-body p-4">
                  <h5 class="mb-4">Editar Elecciones</h5>
                  <div class="row mb-3">
                    <label for="form-label" class="col-sm-3 col-form-label">Imagen</label>
                    <div class="col-sm-9">
                      <input type="hidden" name='image' v-model='photoLink' />
                      <img :src="photoLink" alt="" style="width: inherit;">
                      <button class='btn btn-primary px-4' type='button' @click='openUploadWidget()'>Subir Foto</button>
                    </div>
                  </div>

                </div>
              </div>

            </div>


          </div><!--end row-->

          <!--end breadcrumb-->
          <div class="row">
            <div class="col-xl-12 mx-auto">
              <h6 class="mb-0 text-uppercase">Archivos</h6>
              <hr>
              <div class="card">
                <div class="card-body" v-for="( section, index ) in  sections " :key="index">
                  <div class="mb-3">
                    <label for="formFile" class="form-label">Archivo</label>
                    <input class="form-control" type="file" @change="handleChange(index)" @blur="handleBlur"
                      :id="'files_' + index" name="files" />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Nombre visible del archivo</label>
                    <input type="text" v-model="section.inputValue" class="form-control" name="documentNames"
                      placeholder="Nombre aquí" required>
                  </div>
                  <div class="row">
                    <label class="col-md-3 col-form-label"></label>
                    <div class="col-md-9">
                      <div class="d-md-flex d-grid align-items-center gap-3">
                        <button type="button" class="btn btn-primary px-4" @click.prevent="addSection"
                          :disabled="addBtnisDisabled">Añadir</button>
                        <button type="button" class="btn btn-light px-4" @click="removeSection(index)"
                          :disabled="cancelBtnisDisabled">Quitar
                          elemento</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-12 text-center">
                    <div class="d-md-flex d-grid align-items-center gap-3 text-center">
                      <button type="submit" class="btn btn-primary px-4">Guardar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </Form>
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
  </div>
</template>