import React, { useState } from 'react';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES, AndroidProjectFile } from '../androidFiles';
import {
  FileCode,
  FolderTree,
  Copy,
  Check,
  Download,
  FileText,
  Layers,
  Settings,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export const ProjectCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AndroidProjectFile>(ANDROID_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add all project files into the root folder SyntecxHubCalculator
      const rootFolder = zip.folder('SyntecxHubCalculator');
      if (rootFolder) {
        for (const file of ANDROID_PROJECT_FILES) {
          rootFolder.file(file.path, file.content);
        }

        // Also add standard gradle wrapper properties
        rootFolder.file(
          'gradle/wrapper/gradle-wrapper.properties',
          `distributionBase=GRADLE_USER_HOME\ndistributionPath=wrapper/dists\ndistributionUrl=https\\://services.gradle.org/distributions/gradle-8.4-bin.zip\nzipStoreBase=GRADLE_USER_HOME\nzipStorePath=wrapper/dists\n`
        );

        rootFolder.file(
          'gradle.properties',
          `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8\nandroid.useAndroidX=true\nandroid.nonTransitiveRClass=true\n`
        );
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'SyntecxHubCalculator_AndroidStudio.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate ZIP archive', err);
    } finally {
      setIsZipping(false);
    }
  };

  const getCategoryIcon = (category: AndroidProjectFile['category']) => {
    switch (category) {
      case 'kotlin':
        return <FileCode className="w-4 h-4 text-purple-600" />;
      case 'xml':
        return <Layers className="w-4 h-4 text-emerald-600" />;
      case 'gradle':
        return <Settings className="w-4 h-4 text-amber-700" />;
      case 'manifest':
        return <ShieldCheck className="w-4 h-4 text-amber-600" />;
      default:
        return <FileText className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div id="project-code-viewer" className="w-full bg-white border border-[#EDE5D8] rounded-xl overflow-hidden shadow-xs">
      {/* Top Header */}
      <div className="bg-[#1C1917] text-stone-100 px-5 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#292524]">
        <div>
          <div className="flex items-center gap-2.5">
            <FolderTree className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold text-stone-100">Android Studio Project Workspace</h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Package: <code className="text-amber-300 font-mono">com.example.syntecxhubcalculator</code> · Ready to compile in Android Studio
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-copy-file"
            onClick={handleCopy}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Current File'}</span>
          </button>

          <button
            id="btn-download-zip"
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#92400E] hover:bg-[#78350F] active:bg-[#5C270B] text-white transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isZipping ? 'Packaging ZIP...' : 'Download Android Studio ZIP'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Sidebar: File Tree */}
        <div className="lg:col-span-4 border-r border-[#EDE5D8] bg-[#FAF7F2] p-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Project Files ({ANDROID_PROJECT_FILES.length})
            </div>
            {ANDROID_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-2.5 transition-all text-xs cursor-pointer ${
                    isSelected
                      ? 'bg-[#F5EDE0] text-[#78350F] font-semibold border border-[#E2D5C3] shadow-xs'
                      : 'text-stone-700 hover:bg-[#EFE8DC]/60 hover:text-stone-900'
                  }`}
                >
                  <span className="mt-0.5">{getCategoryIcon(file.category)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="truncate">{file.name}</span>
                      <span className="text-[10px] uppercase tracking-wider text-stone-500 ml-1 font-mono">
                        {file.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 truncate font-mono mt-0.5">{file.path}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Setup Card */}
          <div className="mt-4 p-3 bg-white border border-[#EDE5D8] rounded-lg text-xs text-stone-600 space-y-1.5">
            <div className="font-semibold text-stone-800 flex items-center gap-1.5">
              <span>Android Studio Instructions</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              1. Download the ZIP file above.<br />
              2. Extract the folder.<br />
              3. In Android Studio: <strong>File &gt; Open</strong>.<br />
              4. Click Run (Shift + F10).
            </p>
          </div>
        </div>

        {/* Right Code Display Surface */}
        <div className="lg:col-span-8 flex flex-col bg-[#1e1e1e] text-slate-100 font-mono text-xs">
          {/* File Meta Bar */}
          <div className="bg-[#252526] px-4 py-2.5 flex items-center justify-between border-b border-neutral-800 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 font-semibold">{selectedFile.name}</span>
              <span className="text-neutral-500">·</span>
              <span className="text-neutral-400 font-sans">{selectedFile.description}</span>
            </div>
            <span className="text-neutral-500 font-mono">{selectedFile.language.toUpperCase()}</span>
          </div>

          {/* Code Body with Line Numbers */}
          <div className="flex-1 p-4 overflow-x-auto overflow-y-auto max-h-[520px] scrollbar-thin">
            <pre className="leading-relaxed font-mono">
              <code>
                {selectedFile.content.split('\n').map((line, idx) => (
                  <div key={idx} className="table-row">
                    <span className="table-cell pr-5 select-none text-neutral-600 text-right w-10">
                      {idx + 1}
                    </span>
                    <span className="table-cell whitespace-pre text-[#d4d4d4]">
                      {line}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
