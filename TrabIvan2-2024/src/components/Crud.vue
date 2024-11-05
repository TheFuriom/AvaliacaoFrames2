<template>
  <v-container>
      <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
          :items-length="totalItems" :loading="loading" :search="search" item-value="name"
          @update:options="loadItems">
          <template v-slot:top>
              <v-toolbar flat>
                  <v-toolbar-title>
                      Controle de Casas
                  </v-toolbar-title>
                  <v-toolbar-items>
                      <v-btn @click="addHouse">Adicionar</v-btn>
                  </v-toolbar-items>
              </v-toolbar>
              <v-container>
                  <v-text-field v-model="searchName" label="Pesquisar..." variant="underlined"></v-text-field>
              </v-container>
          </template>
          <template v-slot:item.action="{ item }">
              <v-btn icon="mdi-pencil" @click="editHouse(item)" class="mr-2" />
              <v-btn icon="mdi-delete" @click="remove(item.uuid)" />
          </template>
      </v-data-table-server>
  </v-container>

  <v-dialog v-model="dialog" max-width="600">
      <v-card>
          <v-card-title>Detalhes da Casa</v-card-title>
          <v-card-text>
              <v-text-field label="Endereço" v-model="house.address" />
              <v-text-field label="Cidade" v-model="house.city" />
              <v-text-field label="Estado" v-model="house.state" />
              <v-text-field label="Preço" v-model="house.price" type="number" />
          </v-card-text>
          <v-card-actions>
              <v-btn color="error" @click="dialog = false">Cancelar</v-btn>
              <v-spacer />
              <v-btn color="primary" @click="save">Salvar</v-btn>
          </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import debounce from 'lodash/debounce';

const house = ref({}); // Substituindo client por house
const itemsPerPage = ref(10);
const page = ref(1);
const sortBy = ref([]);
const dialog = ref(false);
const headers = ref([
  { title: 'Endereço', key: 'address' },
  { title: 'Cidade', key: 'city' },
  { title: 'Estado', key: 'state' },
  { title: 'Preço', key: 'price' },
  { title: 'Ações', key: 'action', sortable: false },
]);
const serverItems = ref([]);
const totalItems = ref(0);
const loading = ref(false);
const search = ref('');
const searchName = ref('');

const loadItems = async (options) => {
  loading.value = true;
  let url = 'http://localhost:5000/houses?1';
  if (options) {
      page.value = options.page;
      sortBy.value = options.sortBy;
      if (options.sortBy.length > 0) {
          url += '&sortKey=' + options.sortBy[0].key;
          url += '&sortOrder=' + options.sortBy[0].order;
      }
      if (options.search.length > 0) {
          url += '&search=' + options.search;
      }
      url += '&page=' + options.page || 1;
      url += '&limit=' + options.itemsPerPage || itemsPerPage.value;
  }
  const response = await fetch(url);
  const result = await response.json();
  serverItems.value = result.data;
  totalItems.value = result.total;
  loading.value = false;
}

watch(searchName, debounce(() => {
  search.value = searchName.value;
}, 500));

const remove = async (uuid) => {
  await fetch('http://localhost:5000/houses/' + uuid, { method: 'DELETE' });
  loadItems({ page: page.value, itemsPerPage: itemsPerPage.value, sortBy: sortBy.value, search: searchName.value });
}

const save = () => {
  const method = house.value.uuid ? 'PUT' : 'POST';
  const url = method === 'PUT' ? `http://localhost:5000/houses/${house.value.uuid}` : 'http://localhost:5000/houses';

  fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(house.value),
  })
  .then(() => {
      house.value = {};
      dialog.value = false;
      loadItems({ page: page.value, itemsPerPage: itemsPerPage.value, sortBy: sortBy.value, search: searchName.value });
  })
  .catch(error => console.log(error));
}

// Função para editar uma casa específica
const editHouse = (item) => {
  house.value = { ...item };
  dialog.value = true;
}

// Função para adicionar uma nova casa
const addHouse = () => {
  house.value = { address: '', city: '', state: '', price: '' }; // Inicializa com campos vazios
  dialog.value = true;
}
</script>
