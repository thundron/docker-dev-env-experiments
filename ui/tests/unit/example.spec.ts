import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import URLDataFetch from "@/components/URLDataFetch.vue";

describe("URLDataFetch.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(URLDataFetch, {
      props: { msg },
    });
    expect(wrapper.text()).to.include(msg);
  });
});
