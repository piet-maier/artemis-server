<script setup lang="ts">
import FormInput from "@/components/FormInput.vue";
import SuperiorButton from "@/components/SuperiorButton.vue";
</script>

<template>
  <div class="mx-auto flex h-dvh flex-col justify-center px-4 sm:px-16">
    <form
      class="mx-auto flex w-full max-w-sm flex-col gap-y-6 rounded-lg p-4 pb-32 sm:max-w-md lg:pb-64"
    >
      <h1 class="mx-auto text-xl">Login into Artemis</h1>
      <FormInput
        id="benutzername"
        error-label="soos"
        placeholder="Benutzername"
      />
      <FormInput id="passwort" placeholder="Passwort" type="password" />
      <SuperiorButton type="submit" variant="accent">Login</SuperiorButton>
      <hr />
      <SuperiorButton variant="neutral">Registration</SuperiorButton>
    </form>
  </div>
</template>
