export async function retry<T>(retryTarget: CallableFunction, delay: number): Promise<T> {
  try {
    return await retryTarget()
  } catch (err) {
    return new Promise((resolve, reject) => {
      setTimeout(
        () => retry<T>(retryTarget, delay).then(resolve).catch(reject),
        delay,
      )
    })
  }
}