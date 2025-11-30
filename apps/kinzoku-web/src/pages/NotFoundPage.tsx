import { Button } from "../components/Button/Button";
import { Card, CardContent } from "../components/Card/Card";
import { Home, ArrowLeft, HelpCircle } from "lucide-react";
import { useAppNavigation } from "../utils/useAppNavigation";

export function NotFoundPage() {
  const { goHome, goToDashboard, goToPayment, goToTransactions, goToSupport } =
    useAppNavigation();
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-8xl lg:text-9xl font-thin text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-4">
            404
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 mx-auto rounded-full opacity-50" />
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-thin text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            Oops! The page you're looking for seems to have vanished into the
            digital void. Don't worry, it happens to the best of us.
          </p>
        </div>

        {/* Quick Actions */}
        <Card className="bg-slate-900/30 border-slate-800 mb-8">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold text-white mb-6">
              What would you like to do?
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                variant="glow"
                className="h-16 flex-col space-y-2"
                onClick={goHome}
              >
                <Home className="w-6 h-6" />
                <span>Go Home</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex-col space-y-2 border-slate-700 hover:border-cyan-500/50 bg-transparent"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-6 h-6" />
                <span>Go Back</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Helpful Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Popular Pages</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToDashboard}
              className="text-slate-400 hover:text-cyan-400"
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPayment}
              className="text-slate-400 hover:text-cyan-400"
            >
              Send Payment
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToTransactions}
              className="text-slate-400 hover:text-cyan-400"
            >
              Transactions
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToSupport}
              className="text-slate-400 hover:text-cyan-400"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Get Help
            </Button>
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-sm">
            If you believe this is an error, please{" "}
            <button
              onClick={goToSupport}
              className="text-cyan-400 hover:text-cyan-300 transition-colors underline"
            >
              contact our support team
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
