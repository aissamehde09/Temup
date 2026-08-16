import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-[40vh] place-items-center bg-slate-50 p-6 text-center">
          <div className="max-w-md">
            <p className="text-6xl font-black text-slate-200">500</p>
            <h2 className="mt-4 text-xl font-black text-slate-950">Une erreur est survenue</h2>
            <p className="mt-2 text-sm text-slate-500">Recharge la page ou reviens plus tard.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-lime-700 px-6 py-3 text-sm font-black text-white hover:bg-lime-800"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
