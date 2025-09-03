// Performance optimization utilities

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll events
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// Image lazy loading with intersection observer
export const createImageObserver = (callback) => {
  if (!window.IntersectionObserver) {
    return null;
  }

  return new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.1
    }
  );
};

// Preload critical images
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Batch DOM updates
export const batchDOMUpdates = (callback) => {
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(callback);
  } else {
    setTimeout(callback, 16);
  }
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if (performance.memory) {
    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576),
      total: Math.round(performance.memory.totalJSHeapSize / 1048576),
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
    };
  }
  return null;
};

// Performance timing
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    const result = await fn(...args);
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  };
};
