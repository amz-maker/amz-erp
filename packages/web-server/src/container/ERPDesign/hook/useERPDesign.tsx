export const useERPDesign = <T extends object>(
  onFinish?: ((values: T) => void) | undefined,
  onFinishFailed?: ((errorInfo: any) => void) | undefined,
) => {
  return {
    onFinish,
    onFinishFailed,
  };
};
