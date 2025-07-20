const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Get the existing profile (only one allowed)
const getProfile = async () => {
  let profile = await prisma.profile.findFirst();

  if (!profile) {
    profile = await prisma.profile.create({
      data: {
        fullName: "",
        displayName: "",
        email: "",
        phoneNumber: "",
        bio: "",
        profileImage: "",
      },
    });
  }

  return profile;
};

// Create or update the profile
const upsertProfile = async (data) => {
  const existingProfile = await getProfile();

  if (existingProfile) {
    const { id, ...updateData } = data;

    return await prisma.profile.update({
      where: { id: existingProfile.id },
      data: updateData,
    });
  }
};

module.exports = { getProfile, upsertProfile };
