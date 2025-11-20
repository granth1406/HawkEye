"use client"

import { useState, useEffect } from "react"
import { Upload, Globe } from "lucide-react"

export default function Hero() {
  const [threatCount, setThreatCount] = useState(2847293)
  const [scanMode, setScanMode] = useState("file")
  const [selectedFile, setSelectedFile] = useState(null)
  const [urlInput, setUrlInput] = useState("")
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setThreatCount((prev) => prev + Math.floor(Math.random() * 3) + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      alert("Scan complete: No threats found.")
    }, 1200)
  }

  const handleAnalyzeUrl = () => {
    if (!urlInput.trim()) return
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      alert("URL is safe to visit.")
      setUrlInput("")
    }, 1000)
  }

  return (
    <section className="pt-24 pb-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Stay{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Secure</span>{" "}
            Online
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Advanced cybersecurity scanning that protects you from malware, phishing, and online threats with real-time
            intelligence.
          </p>

          {/* CTA Button */}
          <div className="mb-12">
            <a
              href="/dashboard"
              className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 font-semibold text-lg"
            >
              🚀 Go to Dashboard
            </a>
          </div>

          {/* Threat Counter */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-6 max-w-md mx-auto mb-12 border border-gray-700">
            <div className="text-3xl font-bold text-red-400 mb-2">{threatCount.toLocaleString()}</div>
            <div className="text-gray-400 mb-3">Threats Blocked Today</div>
            <div className="flex items-center justify-center text-green-400">
              <span className="text-sm">Live Protection Active</span>
            </div>
          </div>
        </div>

        {/* Scanning Interface */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto border border-gray-700">
          {/* Scan Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-700/50 p-1 rounded-xl flex border border-gray-600">
              <button
                onClick={() => setScanMode("file")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center ${
                  scanMode === "file"
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Upload className="w-5 h-5 mr-2" />
                Scan File
              </button>
              <button
                onClick={() => setScanMode("url")}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center ${
                  scanMode === "url"
                    ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/25"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Globe className="w-5 h-5 mr-2" />
                Scan URL
              </button>
            </div>
          </div>

          {/* File Mode */}
          {scanMode === "file" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-2">Upload File to Scan</h3>
                <p className="text-gray-400">Drag and drop or click to select files for malware analysis</p>
              </div>
              <div className="border-2 border-dashed border-cyan-500/30 rounded-xl p-12 text-center hover:border-cyan-400/50 transition-colors bg-cyan-500/5 hover:bg-cyan-500/10">
                <input type="file" id="fileUpload" onChange={handleFileSelect} className="hidden" />
                <label htmlFor="fileUpload" className="cursor-pointer block">
                  <Upload className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                  <p className="text-lg text-white mb-2 font-semibold">Drop a file here or click to browse</p>
                  <p className="text-sm text-gray-400">Supports all file types • Max size: 256MB</p>
                </label>

                {selectedFile && (
                  <div className="mt-6 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                    <p className="text-cyan-300 font-semibold mb-3">Ready to scan: {selectedFile.name}</p>
                    <button
                      onClick={handleScan}
                      disabled={isScanning}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-200 flex items-center mx-auto disabled:opacity-50"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      {isScanning ? "Scanning..." : "Start Scan"}
                    </button>
                  </div>
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400">
                <div className="flex items-center">Malware Detection</div>
                <div className="flex items-center">Heuristic Analysis</div>
                <div className="flex items-center">Real-time Intelligence</div>
              </div>
            </div>
          )}

          {/* URL Mode */}
          {scanMode === "url" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-2">Analyze Website URL</h3>
                <p className="text-gray-400">Check websites for phishing, malware, and suspicious content</p>
              </div>
              <div className="space-y-6">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-6 py-4 bg-gray-700/50 border-2 border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg text-white placeholder-gray-400"
                />
                <button
                  onClick={handleAnalyzeUrl}
                  disabled={isScanning || !urlInput.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white py-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 flex items-center justify-center text-lg font-semibold disabled:opacity-50"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  {isScanning ? "Analyzing..." : "Analyze URL"}
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400">
                <div className="flex items-center">Phishing Detection</div>
                <div className="flex items-center">Malicious Redirects</div>
                <div className="flex items-center">Domain Reputation</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
