import axiosClient from "../api/axiosClient";

const invitationService = {
  /**
   * POST /households/:id/invitations
   * Gửi invitations cho nhiều user
   */
  createInvitations(householdId, userIds) {
    return axiosClient.post(`/households/${householdId}/invitations`, { userIds });
  },

  /**
   * GET /invitations/me
   * Lấy pending invitations cho user hiện tại
   */
  getMyInvitations() {
    return axiosClient.get("/invitations/me");
  },

  /**
   * POST /invitations/:id/accept
   */
  acceptInvitation(id) {
    return axiosClient.post(`/invitations/${id}/accept`);
  },

  /**
   * POST /invitations/:id/reject
   */
  rejectInvitation(id) {
    return axiosClient.post(`/invitations/${id}/reject`);
  },
};

export default invitationService;
