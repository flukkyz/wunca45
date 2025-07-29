interface BookingModel {
  room_id?: number;
  people_amount?: number;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  name?: string;
  description?: string;
  meeting_id?: number;
}
export const booking = defineStore("booking", {
  state: () => {
    return {} as BookingModel;
  },
  actions: {
    async clear() {
      this.room_id = undefined;
      this.people_amount = undefined;
      this.start_date = undefined;
      this.end_date = undefined;
      this.start_time = undefined;
      this.end_time = undefined;
      this.name = undefined;
      this.description = undefined;
      this.meeting_id = undefined;
    },
  },
});
