<template>
  <div class="modal-card m-0">
    <top-bar :title="$t('settings.about.title')" @close="$router.back()"></top-bar>
    <section class="modal-card-body">
      <div class="has-text-centered py-2">
        <img width="200px" src="@/assets/logo.svg" />
        <p class="pt-2">{{ $t("footer.ui.productInfo.name") }} {{ version }}</p>
      </div>
      <div class="mt-5">
        <p class="has-text-weight-bold">{{ $t("settings.about.links.title") }}</p>
        <a :href="$t('settings.about.links.url.privacyPolicy')" target="_blank"
          ><p class="pt-4">{{ $t("settings.about.links.label.privacyPolicy") }}</p></a
        >
        <hr class="p-0 my-2" />

        <a :href="$t('settings.about.links.url.pawketWebsite')" target="_blank"
          ><p>{{ $t("settings.about.links.label.pawketWebsite") }}</p></a
        >
        <a :href="$t('settings.about.links.url.github')" target="_blank"
          ><p>{{ $t("settings.about.links.label.github") }}</p></a
        >
        <a :href="$t('settings.about.links.url.twitter')" target="_blank"
          ><p>{{ $t("settings.about.links.label.twitter") }}</p></a
        >
        <a :href="$t('settings.about.links.url.discord')" target="_blank"
          ><p>{{ $t("settings.about.links.label.discord") }}</p></a
        >
        <a href="javascript:void(0)" @click="openDonation()"
          ><p>{{ $t("settings.about.links.label.donate") }}</p></a
        >
      </div>
      <div class="mt-5">
        <p class="has-text-weight-bold">Legal Notices</p>

        <p>
          The app is forked and modified from the Pawket app by Sutu Labs of 17 February 2023. Alphabean, Inc. releases the app under the GNU General Public License, Version 3.0. Licensees may convey the work under the license.
          There is no warranty for this app. The Pawket app is copyright Sutu Labs. The modifications to such software code are copyright 2024 Alphabean, Inc. The license may be viewed
          with a web browser either in the LICENSE file of the frodowallet repository in the frodowallet Github account at
          <a href="https://www.github.com/frodowallet" target="_blank">https://www.github.com/frodowallet</a>, or via <a href="http://www.frodowallet.com/legal/license.html" target="_blank">http://www.frodowallet.com/legal/license.html</a>.
        </p>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { tc } from "@/i18n/i18n";
import { isMobile } from "@/services/view/responsive";
import { Component, Vue } from "vue-property-decorator";
import TopBar from "@/components/Common/TopBar.vue";
import Donate from "./Donate.vue";

@Component({
  components: { TopBar },
})
export default class About extends Vue {
  get version(): string {
    return process.env.VUE_APP_VERSION || tc("footer.ui.error.READ_VERSION_FAILED");
  }
  openDonation(): void {
    this.$buefy.modal.open({
      parent: this,
      component: Donate,
      hasModalCard: true,
      trapFocus: true,
      canCancel: [""],
      fullScreen: isMobile(),
    });
  }
}
</script>

<style scoped lang="scss"></style>
