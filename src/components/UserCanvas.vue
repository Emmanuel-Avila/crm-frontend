<script setup>
import { getUserData } from '../helper/auth';
import router from '../router/index';
import Swal from 'sweetalert2';

const userData = getUserData();

function logout() {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  Swal.fire({
    icon: 'success',
    text: "Ha salido de la plataforma"
  })
  router.push({ name: "login" })

}
</script>
<template>
  <div class="offcanvas offcanvas-start w-260" data-bs-scroll="true" tabindex="-1" id="offcanvasUserDetails">
    <div class="offcanvas-body">
      <div class="user-wrapper">
        <div class="text-center p-3 bg-light rounded">
          <img src="https://placehold.co/110x110" class="rounded-circle p-1 shadow mb-3" width="120" height="120" alt="">
          <h5 class="user-name mb-0 fw-bold">{{ userData.name + " " + userData.surname }}</h5>
          <p class="mb-0">{{ userData.type }}</p>
        </div>
        <div class="list-group list-group-flush mt-3 profil-menu fw-bold">

          <router-link v-if="userData.type === 'COMP'" :to="{ name: 'edit-user' }"
            class="list-group-item list-group-item-action d-flex align-items-center gap-2 border-top"><i
              class="material-icons-outlined">person_outline</i>Profile
          </router-link>
          <a href="javascript:;"
            class="list-group-item list-group-item-action d-flex align-items-center gap-2 border-bottom"
            @click='logout'><i class="material-icons-outlined">power_settings_new</i>Logout</a>
        </div>
      </div>

    </div>
    <div class="offcanvas-footer p-3 border-top">
      <div class="text-center">
        <button type="button" class="btn d-flex align-items-center gap-2" data-bs-dismiss="offcanvas"><i
            class="material-icons-outlined">close</i><span>Cerar Sidebar</span></button>
      </div>
    </div>
  </div>
</template>