<script setup lang="ts">
import FormInput from "@/components/FormInput.vue";
import SuperiorButton from "@/components/SuperiorButton.vue";
</script>

<template>
  <div
    class="mx-auto mt-32 flex flex-col justify-center px-4 sm:mt-48 sm:px-16 md:mt-64"
  >
    <form
      class="mx-auto flex w-full max-w-sm flex-col gap-y-6 rounded-lg p-4 sm:max-w-md"
    >
      <h1 class="mx-auto">Login into Artemis</h1>
      <FormInput id="benutzername" placeholder="Benutzername" />
      <FormInput id="passwort" placeholder="Passwort" type="password" />
      <SuperiorButton type="submit" variant="accent">Login</SuperiorButton>
      <hr />
      <SuperiorButton variant="neutral">Registration</SuperiorButton>
    </form>
  </div>
</template>
