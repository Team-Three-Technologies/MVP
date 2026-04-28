let currentDipUuid: string | null = null;

export const setCurrentDipUuid = (uuid: string) => {
  currentDipUuid = uuid;
};

export const getCurrentDipUuid = () => currentDipUuid;
